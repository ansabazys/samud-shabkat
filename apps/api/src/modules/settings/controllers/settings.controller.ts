import type { FastifyRequest, FastifyReply } from "fastify";
import { settingsService } from "../services/settings.service.js";
import type { UpdateSettingsInput } from "../schemas/settings.schema.js";

export class SettingsController {
  async getSettings(_request: FastifyRequest, reply: FastifyReply) {
    const config = await settingsService.getSettings();
    return reply.send({ success: true, data: config });
  }

  async updateSettings(
    request: FastifyRequest<{ Body: UpdateSettingsInput }>,
    reply: FastifyReply,
  ) {
    const updated = await settingsService.updateSettings(request.body);
    return reply.send({
      success: true,
      message: "Settings updated successfully",
      data: updated,
    });
  }
}

export const settingsController = new SettingsController();
