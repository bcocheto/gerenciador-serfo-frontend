import api from "./api";
import { BaseFilters, PaginatedResponse } from "@/types/api";
import { Voluntario } from "./voluntarioService";
import { Assistido } from "./assistidoService";
import { Sede } from "./sedeService";

export interface SuperAdminDashboard {
  sedes: {
    total: number;
    ativas: number;
    inativas: number;
  };
  voluntarios: {
    total: number;
    ativos: number;
    inativos: number;
  };
  assistidos: {
    total: number;
    ativos: number;
    inativos: number;
  };
  statsPorSede: Array<{
    id: number;
    nome: string;
    ativo: boolean;
    voluntarios: number;
    assistidos: number;
  }>;
}

export interface CreateUserRequest {
  nomeCompleto: string;
  email: string;
  telefone?: string;
  endereco?: string;
  dataIngresso: string;
  sedeId: number;
  cargo:
    | "PRESIDENTE"
    | "SECRETARIO"
    | "TESOUREIRO"
    | "VOLUNTARIO"
    | "SUPER_ADMIN";
  observacoes?: string;
  password?: string;
}

export type UpdateUserRequest = Partial<CreateUserRequest>;

export interface TransferUserRequest {
  newSedeId: number;
}

export interface SuperAdminFilters extends BaseFilters {
  search?: string;
  sedeId?: number;
  cargo?: string;
  ativo?: boolean;
}

export interface AssistidoFilters extends BaseFilters {
  search?: string;
  sedeId?: number;
  status?: string;
  valorMin?: number;
  valorMax?: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userId?: number;
  sedeId?: number;
  timestamp: string;
}

export interface SuperAdminSede {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  cep: string;
  telefone: string;
  email: string;
  isAtiva: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    voluntarios: number;
    assistidos: number;
  };
}

export const superAdminService = {
  // Dashboard
  getDashboard: async (): Promise<SuperAdminDashboard> => {
    const response = await api.get("/super-admin/dashboard");
    return response.data.data;
  },

  // Gestão de usuários
  getAllUsers: async (
    filters: SuperAdminFilters = {}
  ): Promise<PaginatedResponse<Voluntario>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/super-admin/users?${params.toString()}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<Voluntario> => {
    const response = await api.post("/super-admin/users", data);
    return response.data.data;
  },

  updateUser: async (
    id: string,
    data: UpdateUserRequest
  ): Promise<Voluntario> => {
    const response = await api.put(`/super-admin/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/super-admin/users/${id}`);
  },

  transferUser: async (
    userId: string,
    data: TransferUserRequest
  ): Promise<Voluntario> => {
    const response = await api.patch(
      `/super-admin/users/${userId}/transfer`,
      data
    );
    return response.data.data;
  },

  // Gestão de assistidos
  getAllAssistidos: async (
    filters: AssistidoFilters = {}
  ): Promise<Assistido[]> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(
      `/super-admin/assistidos?${params.toString()}`
    );
    return response.data.data || response.data;
  },

  createAssistido: async (
    data: Record<string, unknown>
  ): Promise<Assistido> => {
    const response = await api.post("/super-admin/assistidos", data);
    return response.data.data;
  },

  updateAssistido: async (
    id: string,
    data: Record<string, unknown>
  ): Promise<Assistido> => {
    const response = await api.put(`/super-admin/assistidos/${id}`, data);
    return response.data.data;
  },

  deleteAssistido: async (id: number): Promise<void> => {
    await api.delete(`/super-admin/assistidos/${id}`);
  },

  // Gestão de sedes
  getAllSedes: async (): Promise<SuperAdminSede[]> => {
    const response = await api.get("/super-admin/sedes");
    return response.data.data || response.data;
  },

  createSede: async (
    data: Record<string, unknown>
  ): Promise<SuperAdminSede> => {
    const response = await api.post("/super-admin/sedes", data);
    return response.data.data;
  },

  updateSede: async (
    id: number,
    data: Record<string, unknown>
  ): Promise<SuperAdminSede> => {
    const response = await api.put(`/super-admin/sedes/${id}`, data);
    return response.data.data;
  },

  deleteSede: async (id: number): Promise<void> => {
    await api.delete(`/super-admin/sedes/${id}`);
  },

  // Logs de atividade
  getActivityLogs: async (
    filters: BaseFilters & {
      sedeId?: number;
      action?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<PaginatedResponse<ActivityLog>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(
      `/super-admin/activity-logs?${params.toString()}`
    );
    return response.data;
  },
};

export default superAdminService;
