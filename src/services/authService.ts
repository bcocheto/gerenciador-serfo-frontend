import api from "./api";
import { User } from "@/contexts/AuthContext";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export const authService = {
  // Login do usuário
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Logout do usuário
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // Refresh do token
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await api.post("/auth/refresh");
    return response.data;
  },

  // Verificar se o token é válido
  verifyToken: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Alterar senha
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<void> => {
    await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  },
};
