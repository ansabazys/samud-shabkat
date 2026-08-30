import type { FastifyInstance } from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import compress from "@fastify/compress";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import path from "node:path";
import fs from "node:fs";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export async function registerPlugins(app: FastifyInstance) {
  await app.register(helmet, {
    crossOriginResourcePolicy: { policy: "cross-origin" },
  });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
    ],
  });

  // Enable Gzip/Deflate compression for fast response transmission
  await app.register(compress, {
    global: true,
    threshold: 1024, // Compress responses > 1KB
    encodings: ["gzip", "deflate"],
  });

  await app.register(cookie, {
    secret: process.env.COOKIE_SECRET || "development-cookie-secret",
  });

  await app.register(jwt, {
    secret: process.env.JWT_SECRET || "development-jwt-secret",
  });

  await app.register(rateLimit, {
    max: 150,
    timeWindow: "1 minute",
    errorResponseBuilder: () => ({
      statusCode: 429,
      error: "Too Many Requests",
      message:
        "Rate limit exceeded. Please wait a minute before sending more requests.",
    }),
  });

  await app.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
  });

  // Serve locally uploaded files
  const uploadsPath = path.resolve(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  await app.register(fastifyStatic, {
    root: uploadsPath,
    prefix: "/uploads/",
    decorateReply: false,
  });

  await app.register(swagger, {
    openapi: { info: { title: "Samud Shabkat API", version: "0.0.0" } },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUi, { routePrefix: "/documentation" });
}
