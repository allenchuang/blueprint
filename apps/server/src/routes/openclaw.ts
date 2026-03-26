import type { FastifyInstance } from "fastify";
import { readFileSync } from "fs";

const OPENCLAW_DIR = process.env.OPENCLAW_DIR ?? `${process.env.HOME}/.openclaw`;
const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_HTTP_URL ?? "http://127.0.0.1:18789";
const DEFAULT_SESSION_KEY = process.env.OPENCLAW_SESSION_KEY ?? "agent:main:main";

function getGatewayToken(): string {
  try {
    const cfg = JSON.parse(readFileSync(`${OPENCLAW_DIR}/openclaw.json`, "utf8")) as {
      gateway?: { auth?: { token?: string } };
    };
    return cfg.gateway?.auth?.token ?? process.env.OPENCLAW_GATEWAY_TOKEN ?? "";
  } catch {
    return process.env.OPENCLAW_GATEWAY_TOKEN ?? "";
  }
}

export async function openclawRoutes(app: FastifyInstance) {
  const errorSchema = {
    type: "object",
    properties: { error: { type: "string" } },
  } as const;

  // GET /api/openclaw/status
  app.get("/openclaw/status", {
    schema: {
      description: "Get OpenClaw gateway status",
      tags: ["openclaw"],
      response: { 200: { type: "object", additionalProperties: true }, 502: errorSchema },
    },
  }, async (_req, reply) => {
    try {
      const res = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getGatewayToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "openclaw", messages: [{ role: "user", content: "ping" }] }),
        signal: AbortSignal.timeout(5000),
      });
      return { ok: res.ok, status: res.status };
    } catch {
      return reply.status(502).send({ error: "Gateway unreachable" });
    }
  });

  // POST /api/openclaw/chat — send message, wait for full response
  app.post("/openclaw/chat", {
    schema: {
      description: "Send a message and get the full agent response",
      tags: ["openclaw"],
      body: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
          sessionKey: { type: "string" },
        },
      },
      response: {
        200: {
          type: "object",
          properties: { reply: { type: "string" }, id: { type: "string" } },
        },
        502: errorSchema,
        504: errorSchema,
      },
    },
  }, async (request, reply) => {
    const body = request.body as { message: string; sessionKey?: string };
    const sessionKey = body.sessionKey ?? DEFAULT_SESSION_KEY;
    const token = getGatewayToken();

    try {
      const res = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-openclaw-session-key": sessionKey,
        },
        body: JSON.stringify({
          model: "openclaw",
          messages: [{ role: "user", content: body.message }],
        }),
        signal: AbortSignal.timeout(120_000), // 2 min max
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } })) as {
          error?: { message?: string };
        };
        return reply.status(502).send({ error: err.error?.message ?? `Gateway returned ${res.status}` });
      }

      const data = await res.json() as {
        id?: string;
        choices?: Array<{ message?: { content?: string } }>;
      };

      const text = data.choices?.[0]?.message?.content ?? "";
      return { reply: text, id: data.id ?? randomUUID() };

    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        return reply.status(504).send({ error: "Agent timed out" });
      }
      return reply.status(502).send({ error: err instanceof Error ? err.message : "Unknown error" });
    }
  });
}
