import { client } from "./index.js";

async function main() {
  if (!client) {
    console.error("No client");
    process.exit(1);
  }

  try {
    const tables = await client`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `;
    console.log("📊 Existing Tables:", tables);

    for (const t of tables) {
      if (t.table_schema === "public") {
        const count =
          await client`SELECT COUNT(*) FROM ${client(t.table_name)}`;
        console.log(`Table ${t.table_name}: ${count[0].count} rows`);
      }
    }

    try {
      const migrations =
        await client`SELECT * FROM drizzle.__drizzle_migrations ORDER BY created_at ASC;`;
      console.log(
        "📜 Applied Migrations in drizzle.__drizzle_migrations:",
        migrations,
      );
    } catch (e: unknown) {
      console.log(
        "⚠️ Could not read drizzle.__drizzle_migrations:",
        e instanceof Error ? e.message : String(e),
      );
    }
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await client.end();
  }
}

main();
