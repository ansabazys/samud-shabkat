import "@fastify/jwt";
import "fastify";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
  permissionsVersion: number;
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      id: string;
      email: string;
      role: string;
      permissionsVersion: number;
      iat?: number;
      exp?: number;
    };
    user: AuthenticatedUser;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser;
  }
}
