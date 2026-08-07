import type { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(helmet);
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
  });
  await app.register(cookie, { secret: process.env.COOKIE_SECRET });
  await app.register(jwt, {
    secret: process.env.JWT_SECRET ?? "development-secret",
  });
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message:
        "Rate limit exceeded. Please wait a minute before sending more requests.",
    }),
  });
  await app.register(multipart);
  await app.register(swagger, {
    openapi: { info: { title: "Samud Shabkat API", version: "0.0.0" } },
  });
  await app.register(swaggerUi, { routePrefix: "/documentation" });
}
