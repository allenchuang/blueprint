import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { appConfig } from "@repo/app-config";
import { healthRoutes } from "./routes/health.js";
import { exampleRoutes } from "./routes/example.js";
import { stripeRoutes } from "./routes/stripe.js";
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
        title: `${appConfig.name} API`,
        description: `${appConfig.name} API documentation`,
        version: appConfig.version,
      },
      servers: [
        {
          url: appConfig.urls.api,
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
  await app.register(stripeRoutes, { prefix: "/api" });

  return app;
}
