import { getClient } from "./index.js";

async function main() {
  const client = getClient();
  const dbUrl = process.env.DATABASE_URL;

  if (!client || !dbUrl) {
    console.error("❌ DATABASE_URL is not set in environment.");
    process.exit(1);
  }

  // Obfuscate credentials for safe output
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");
  console.log(`🔍 Checking database connection to: ${maskedUrl}`);

  const startTime = Date.now();
  try {
    const result = await client`SELECT version(), current_database(), current_user;`;
    const latency = Date.now() - startTime;

    console.log("✅ Database connection successful!");
    console.log(`⏱️ Latency: ${latency}ms`);
    if (result && result[0]) {
      console.log(`📦 Database: ${result[0].current_database}`);
      console.log(`👤 User: ${result[0].current_user}`);
      const isNeon = dbUrl.includes("neon.tech");
      console.log(`🌐 Provider: ${isNeon ? "Neon Serverless Postgres" : "Standard PostgreSQL"}`);
      console.log(`🏷️ Version: ${result[0].version.split("\n")[0]}`);
    }
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
