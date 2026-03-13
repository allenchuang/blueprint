import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { healthRoutes } from "./routes/health";
import { exampleRoutes } from "./routes/example";

export async function buildApp() {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors, {
    origin: true,
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Mastermind API",
        description: "Mastermind API documentation",
        version: "0.1.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Development server",
        },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
  });

  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(exampleRoutes, { prefix: "/api" });

  return app;
}
