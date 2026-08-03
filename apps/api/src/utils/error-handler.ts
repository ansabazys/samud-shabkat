import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);
  return reply.status(error.statusCode ?? 500).send({
    statusCode: error.statusCode ?? 500,
    message: error.statusCode ? error.message : "Internal Server Error",
  });
}
