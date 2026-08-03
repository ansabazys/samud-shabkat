import "dotenv/config";
import { buildApp } from "./app.js";
const app = await buildApp();
const close = async () => {
  await app.close();
  process.exit(0);
};
process.on("SIGINT", close);
process.on("SIGTERM", close);
await app.listen({ host: "0.0.0.0", port: Number(process.env.PORT ?? 4000) });
