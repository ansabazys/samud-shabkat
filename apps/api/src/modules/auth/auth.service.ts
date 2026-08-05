import { authRepository } from "./auth.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import { JwtService } from "./jwt.service.js";
import type { FastifyInstance } from "fastify";
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  UserResponse,
} from "./auth.types.js";

export class AuthService {
  private jwtService: JwtService;

  constructor(app: FastifyInstance) {
    this.jwtService = new JwtService(app);
  }

  private formatUserResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyName?: string | null;
  }): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyName: user.companyName ?? null,
    };
  }

  async register(input: RegisterInput): Promise<{ message: string }> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      const error = new Error("Account with this email already exists");
      Object.assign(error, { statusCode: 409 });
      throw error;
    }

    const passwordHash = await passwordService.hash(input.password);
    await authRepository.createUserWithProfile(input, passwordHash);

    return { message: "User registered successfully" };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await authRepository.findByEmail(input.email);
    if (!user || !user.isActive) {
      const error = new Error("Invalid email or password");
      Object.assign(error, { statusCode: 401 });
      throw error;
    }

    const isPasswordValid = await passwordService.verify(
      user.passwordHash,
      input.password,
    );
    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      Object.assign(error, { statusCode: 401 });
      throw error;
    }

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      permissionsVersion: 1,
    });

    const refreshToken = tokenService.generateRefreshToken();
    await tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: this.formatUserResponse(user),
    };
  }

  async refresh(
    currentRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await authRepository.findByRefreshToken(currentRefreshToken);
    if (!user || !user.isActive) {
      const error = new Error("Invalid or expired refresh token");
      Object.assign(error, { statusCode: 401 });
      throw error;
    }

    const newAccessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      permissionsVersion: 1,
    });

    // Refresh token rotation
    const newRefreshToken = tokenService.generateRefreshToken();
    await tokenService.saveRefreshToken(user.id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<{ message: string }> {
    await tokenService.revokeRefreshToken(userId);
    return { message: "Logged out successfully" };
  }
}
