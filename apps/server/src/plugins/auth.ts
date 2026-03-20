import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { createDb } from "@repo/db";
import { users } from "@repo/db/schema";
import { eq } from "drizzle-orm";

const DYNAMIC_ENVIRONMENT_ID = process.env.DYNAMIC_ENVIRONMENT_ID;

export interface DynamicUser {
  sub: string;
  email?: string;
  scope: string;
}

declare module "fastify" {
  interface FastifyRequest {
    dynamicUser?: DynamicUser;
  }
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

async function authPlugin(app: FastifyInstance) {
  if (!DYNAMIC_ENVIRONMENT_ID) {
    app.log.warn(
      "DYNAMIC_ENVIRONMENT_ID not set — auth plugin disabled, all routes unauthenticated"
    );

    app.decorate(
      "authenticate",
      async (_request: FastifyRequest, _reply: FastifyReply) => {
        // No-op when auth is not configured
      }
    );
    return;
  }

  const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${DYNAMIC_ENVIRONMENT_ID}/.well-known/jwks`;

  const jwksClient = new JwksClient({
    jwksUri: jwksUrl,
    rateLimit: true,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 600_000,
  });

  const databaseUrl = process.env.DATABASE_URL;
  const db = databaseUrl ? createDb(databaseUrl) : null;

  async function getSigningKey(): Promise<string> {
    const key = await jwksClient.getSigningKey();
    return key.getPublicKey();
  }

  async function upsertUser(dynamicUserId: string, email?: string) {
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

  app.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.slice(7);

      try {
        const publicKey = await getSigningKey();
        const decoded = jwt.verify(token, publicKey, {
          algorithms: ["RS256"],
        }) as DynamicUser;

        const scopes = (decoded.scope || "").split(" ");
        if (!scopes.includes("user:basic")) {
          return reply
            .status(401)
            .send({ error: "Authentication incomplete — scope missing user:basic" });
        }

        request.dynamicUser = decoded;

        await upsertUser(decoded.sub, decoded.email).catch((err) => {
          app.log.error(err, "Failed to upsert user during auth");
        });
      } catch (err) {
        app.log.error(err, "JWT verification failed");
        return reply.status(401).send({ error: "Invalid or expired token" });
      }
    }
  );
}

export default fp(authPlugin, {
  name: "dynamic-auth",
});
