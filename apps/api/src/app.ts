import Fastify from "fastify";
import { registerPlugins } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./utils/error-handler.js";

export async function buildApp() {
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL ?? "info" } });
  app.setErrorHandler(errorHandler);

  await registerPlugins(app);
  await registerRoutes(app);
  return app;
}
