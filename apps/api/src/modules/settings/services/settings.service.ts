import { settings } from "@samud/database";
import { sql } from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type { UpdateSettingsInput } from "../schemas/settings.schema.js";

export class SettingsService {
  async getSettings() {
    const database = getDb();
    const [record] = await database.select().from(settings).limit(1);

    if (!record) {
      // Create default row if missing
      const [newRecord] = await database
        .insert(settings)
        .values({})
        .returning();
      return newRecord;
    }

    return record;
  }

  async updateSettings(data: UpdateSettingsInput) {
    const database = getDb();
    const current = await this.getSettings();

    const [updated] = await database
      .update(settings)
      .set({
        ...data,
        updatedAt: sql`NOW()`,
      })
      .where(sql`${settings.id} = ${current.id}`)
      .returning();

    return updated;
  }
}

export const settingsService = new SettingsService();
