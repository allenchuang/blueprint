import type { FastifyInstance } from "fastify";

const OPENCLAW_GATEWAY_URL =
  process.env.OPENCLAW_GATEWAY_URL ?? "http://127.0.0.1:18789";

async function proxyToGateway(
  path: string,
  options?: { method?: string; body?: unknown }
) {
  const method = options?.method ?? "GET";
  const res = await fetch(`${OPENCLAW_GATEWAY_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(process.env.OPENCLAW_GATEWAY_TOKEN
        ? { Authorization: `Bearer ${process.env.OPENCLAW_GATEWAY_TOKEN}` }
        : {}),
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gateway returned ${res.status}: ${text}`);
  }

  return res.json();
}

export async function openclawRoutes(app: FastifyInstance) {
  const errorResponse = {
    type: "object",
    properties: { error: { type: "string" } },
  } as const;

  app.get("/openclaw/status", {
    schema: {
      description: "Get OpenClaw gateway status",
      tags: ["openclaw"],
      response: {
        200: { type: "object", additionalProperties: true },
        502: errorResponse,
      },
    },
  }, async (_request, reply) => {
    try {
      const data = await proxyToGateway("/api/health");
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gateway unreachable";
      return reply.status(502).send({ error: message });
    }
  });

  app.get("/openclaw/sessions", {
    schema: {
      description: "List active OpenClaw sessions",
      tags: ["openclaw"],
      response: {
        200: { type: "object", additionalProperties: true },
        502: errorResponse,
      },
    },
  }, async (_request, reply) => {
    try {
      const data = await proxyToGateway("/api/sessions");
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gateway unreachable";
      return reply.status(502).send({ error: message });
    }
  });

  app.post("/openclaw/message", {
    schema: {
      description: "Send a message to an OpenClaw agent",
      tags: ["openclaw"],
      body: {
        type: "object",
        required: ["message"],
        properties: {
          message: { type: "string" },
          agentId: { type: "string" },
          sessionKey: { type: "string" },
        },
      },
      response: {
        200: { type: "object", additionalProperties: true },
        502: errorResponse,
      },
    },
  }, async (request, reply) => {
    try {
      const data = await proxyToGateway("/api/message", {
        method: "POST",
        body: request.body,
      });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gateway unreachable";
      return reply.status(502).send({ error: message });
    }
  });
}
