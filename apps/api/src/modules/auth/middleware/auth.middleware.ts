import type { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (error) {
    request.log.error(error);
    const authError = new Error(
      "Authentication required: Invalid or expired access token",
    );
    Object.assign(authError, { statusCode: 401 });
    throw authError;
  }
}

export async function optionalAuthenticate(
  request: FastifyRequest,
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      await request.jwtVerify();
    }
  } catch {
    (request as any).user = null;
  }
}
