import type { FastifyRequest, FastifyReply } from "fastify";
import { mediaService } from "../services/media.service.js";
import type { UploadFolder } from "../schemas/media.schema.js";

export class MediaController {
  async uploadSingle(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file();
      if (!data) {
        return reply
          .status(400)
          .send({ success: false, message: "No file uploaded" });
      }

      const buffer = await data.toBuffer();
      const folder =
        (request.query as { folder?: UploadFolder })?.folder || "products";

      const uploaded = await mediaService.processAndUploadFile(
        buffer,
        data.filename,
        data.mimetype,
        folder,
      );

      return reply.send({
        success: true,
        message: "File uploaded successfully",
        data: uploaded,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload file";
      return reply.status(500).send({ success: false, message });
    }
  }

  async uploadMultiple(request: FastifyRequest, reply: FastifyReply) {
    try {
      const parts = request.files();
      const folder =
        (request.query as { folder?: UploadFolder })?.folder || "products";
      const results = [];

      for await (const part of parts) {
        if (part.file) {
          const buffer = await part.toBuffer();
          const uploaded = await mediaService.processAndUploadFile(
            buffer,
            part.filename,
            part.mimetype,
            folder,
          );
          results.push(uploaded);
        }
      }

      return reply.send({
        success: true,
        message: `${results.length} files uploaded successfully`,
        data: results,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to batch upload files";
      return reply.status(500).send({ success: false, message });
    }
  }
}

export const mediaController = new MediaController();
