import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { PrivyClient } from "@privy-io/node";
import { createDb } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

const DYNAMIC_ENVIRONMENT_ID = process.env.DYNAMIC_ENVIRONMENT_ID;
const PRIVY_APP_ID = process.env.PRIVY_APP_ID;
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
const PRIVY_VERIFICATION_KEY = process.env.PRIVY_VERIFICATION_KEY;

export interface AuthUser {
  sub: string;
  email?: string;
  provider: "dynamic" | "privy";
}

declare module "fastify" {
  interface FastifyRequest {
    dynamicUser?: AuthUser;
    privyUser?: AuthUser;
    authUser?: AuthUser;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

async function authPlugin(app: FastifyInstance) {
  const authConfigured = Boolean(DYNAMIC_ENVIRONMENT_ID) || Boolean(PRIVY_APP_ID && PRIVY_APP_SECRET);

  if (!authConfigured) {
    app.log.warn(
      "No auth provider configured — auth plugin disabled, all routes unauthenticated"
    );

    app.decorate(
      "authenticate",
      async (_request: FastifyRequest, _reply: FastifyReply) => {
        // No-op when auth is not configured
      }
    );
    return;
  }

  const databaseUrl = process.env.DATABASE_URL;
  const db = databaseUrl ? createDb(databaseUrl) : null;

  // Dynamic setup
  let jwksClient: JwksClient | null = null;
  if (DYNAMIC_ENVIRONMENT_ID) {
    const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`;
    jwksClient = new JwksClient({
      jwksUri: jwksUrl,
      rateLimit: true,
      cache: true,
      cacheMaxEntries: 5,
      cacheMaxAge: 600_000,
    });
  }

  // Privy setup
  let privyClient: PrivyClient | null = null;
  if (PRIVY_APP_ID && PRIVY_APP_SECRET) {
    const privyOpts: ConstructorParameters<typeof PrivyClient>[0] = {
      appId: PRIVY_APP_ID,
      appSecret: PRIVY_APP_SECRET,
    };
    if (PRIVY_VERIFICATION_KEY) {
      privyOpts.jwtVerificationKey = PRIVY_VERIFICATION_KEY;
    }
    privyClient = new PrivyClient(privyOpts);
  }

  async function upsertDynamicUser(dynamicUserId: string, email?: string) {
    if (!db) return;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.dynamicUserId, dynamicUserId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({
        dynamicUserId,
        email: email ?? `${dynamicUserId}@dynamic.xyz`,
      });
    } else if (email && existing[0].email !== email) {
      await db
        .update(users)
        .set({ email, updatedAt: new Date() })
        .where(eq(users.dynamicUserId, dynamicUserId));
    }
  }

  async function upsertPrivyUser(privyUserId: string, email?: string) {
    if (!db) return;

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.privyUserId, privyUserId))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(users).values({
        privyUserId,
        email: email ?? `${privyUserId}@privy.io`,
      });
    } else if (email && existing[0].email !== email) {
      await db
        .update(users)
        .set({ email, updatedAt: new Date() })
        .where(eq(users.privyUserId, privyUserId));
    }
  }

  async function verifyDynamic(token: string): Promise<AuthUser | null> {
    if (!jwksClient) return null;

    try {
      const key = await jwksClient.getSigningKey();
      const publicKey = key.getPublicKey();
      const decoded = jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      }) as { sub: string; email?: string; scope: string };

      const scopes = (decoded.scope || "").split(" ");
      if (!scopes.includes("user:basic")) return null;

      return { sub: decoded.sub, email: decoded.email, provider: "dynamic" };
    } catch {
      return null;
    }
  }

  async function verifyPrivy(token: string): Promise<AuthUser | null> {
    if (!privyClient) return null;

    try {
      const verifiedClaims = await privyClient.verifyAuthToken(token);
      return { sub: verifiedClaims.userId, provider: "privy" };
    } catch {
      return null;
    }
  }

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.slice(7);

      // Try Dynamic first if configured
      const dynamicResult = await verifyDynamic(token);
      if (dynamicResult) {
        request.dynamicUser = dynamicResult;
        request.authUser = dynamicResult;
        await upsertDynamicUser(dynamicResult.sub, dynamicResult.email).catch((err) => {
          app.log.error(err, "Failed to upsert Dynamic user during auth");
        });
        return;
      }

      // Try Privy if configured
      const privyResult = await verifyPrivy(token);
      if (privyResult) {
        request.privyUser = privyResult;
        request.authUser = privyResult;
        await upsertPrivyUser(privyResult.sub, privyResult.email).catch((err) => {
          app.log.error(err, "Failed to upsert Privy user during auth");
        });
        return;
      }

      app.log.error("JWT verification failed for all configured providers");
      return reply.status(401).send({ error: "Invalid or expired token" });
    }
  );
}

export default fp(authPlugin, {
  name: "auth",
});
