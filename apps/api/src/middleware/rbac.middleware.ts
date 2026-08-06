import type { FastifyRequest } from "fastify";

export function requireRole(...allowedRoles: string[]) {
  return async (request: FastifyRequest): Promise<void> => {
    if (!request.user) {
      const error = new Error("Authentication required");
      Object.assign(error, { statusCode: 401 });
      throw error;
    }

    const userRole = request.user.role ? request.user.role.toUpperCase() : "";
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    // Super admin bypasses all role checks
    if (userRole === "SUPER_ADMIN" || userRole === "SUPERADMIN") {
      return;
    }

    if (!normalizedAllowed.includes(userRole)) {
      const error = new Error("Forbidden: Insufficient permissions");
      Object.assign(error, { statusCode: 403 });
      throw error;
    }
  };
}
