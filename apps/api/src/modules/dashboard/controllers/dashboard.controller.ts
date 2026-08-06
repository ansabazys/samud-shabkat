import type { FastifyRequest, FastifyReply } from "fastify";
import { dashboardService } from "../services/dashboard.service.js";

export class DashboardController {
  async getStats(_request: FastifyRequest, reply: FastifyReply) {
    const stats = await dashboardService.getStats();
    return reply.send({ success: true, data: stats });
  }
}

export const dashboardController = new DashboardController();
