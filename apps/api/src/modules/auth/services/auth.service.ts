import { authRepository } from "../repositories/auth.repository.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";
import { JwtService } from "./jwt.service.js";
import { formatUserResponse } from "../utils/auth.utils.js";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";
import { notificationService } from "../../notifications/index.js";
import type { FastifyInstance } from "fastify";
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
} from "../types/auth.types.js";

export class AuthService {
  private jwtService: JwtService;

  constructor(app: FastifyInstance) {
    this.jwtService = new JwtService(app);
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      const error = new Error("Account with this email already exists");
      Object.assign(error, { statusCode: 409 });
      throw error;
    }

    const passwordHash = await passwordService.hash(input.password);
    const user = await authRepository.createUserWithProfile(input, passwordHash);

    // Trigger welcome notification in background
    notificationService
      .notifyUserWelcome({
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
      })
      .catch((err) => console.error("[AuthService] Welcome email error:", err));

    const accessToken = this.jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
      permissionsVersion: AUTH_CONSTANTS.DEFAULT_PERMISSIONS_VERSION,
    });

    const refreshToken = tokenService.generateRefreshToken();
    await tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: formatUserResponse(user),
    };
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
      permissionsVersion: AUTH_CONSTANTS.DEFAULT_PERMISSIONS_VERSION,
    });

    const refreshToken = tokenService.generateRefreshToken();
    await tokenService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: formatUserResponse(user),
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
      permissionsVersion: AUTH_CONSTANTS.DEFAULT_PERMISSIONS_VERSION,
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
