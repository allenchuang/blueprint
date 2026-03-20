import type { FastifyInstance } from "fastify";

export async function exampleRoutes(app: FastifyInstance) {
  app.get(
    "/example",
    {
      schema: {
        description: "Example endpoint",
        tags: ["example"],
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    async () => {
      return { message: "Hello from Blueprint API" };
    }
  );

  app.post(
    "/example",
    {
      schema: {
        description: "Create example resource",
        tags: ["example"],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body as { name: string };
      reply.status(201);
      return { id: crypto.randomUUID(), name };
    }
  );
}
