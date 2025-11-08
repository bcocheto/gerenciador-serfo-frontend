import api from "./api";
import { BaseFilters, PaginatedResponse, Status } from "@/types/api";

export interface Voluntario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataIngresso: string;
  status: Status;
  observacoes?: string;
  sedeId: number;
  cargo:
    | "PRESIDENTE"
    | "SECRETARIO"
    | "TESOUREIRO"
    | "VOLUNTARIO"
    | "SUPER_ADMIN";
  sede?: {
    id: number;
    nome: string;
  };
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateVoluntarioRequest {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataIngresso: string;
  observacoes?: string;
  sedeId: number;
  cargo:
    | "PRESIDENTE"
    | "SECRETARIO"
    | "TESOUREIRO"
    | "VOLUNTARIO"
    | "SUPER_ADMIN";
}

export interface UpdateVoluntarioRequest
  extends Partial<CreateVoluntarioRequest> {
  status?: Status;
}

export interface VoluntarioFilters extends BaseFilters {
  status?: Status;
  dataIngressoInicio?: string;
  dataIngressoFim?: string;
}

export const voluntarioService = {
  // Listar voluntários com paginação e filtros
  getVoluntarios: async (
    filters: VoluntarioFilters = {}
  ): Promise<PaginatedResponse<Voluntario>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/voluntarios?${params.toString()}`);
    return response.data;
  },

  // Buscar voluntário por ID
  getVoluntarioById: async (id: string): Promise<Voluntario> => {
    const response = await api.get(`/voluntarios/${id}`);
    return response.data;
  },

  // Criar novo voluntário
  createVoluntario: async (
    data: CreateVoluntarioRequest
  ): Promise<Voluntario> => {
    const response = await api.post("/voluntarios", data);
    return response.data;
  },

  // Atualizar voluntário
  updateVoluntario: async (
    id: string,
    data: UpdateVoluntarioRequest
  ): Promise<Voluntario> => {
    const response = await api.put(`/voluntarios/${id}`, data);
    return response.data;
  },

  // Inativar voluntário
  inativarVoluntario: async (id: string): Promise<void> => {
    await api.patch(`/voluntarios/${id}/inativar`);
  },

  // Reativar voluntário
  reativarVoluntario: async (id: string): Promise<void> => {
    await api.patch(`/voluntarios/${id}/reativar`);
  },

  // Excluir voluntário (soft delete)
  deleteVoluntario: async (id: string): Promise<void> => {
    await api.delete(`/voluntarios/${id}`);
  },

  // Buscar voluntários ativos para seleção
  getVoluntariosAtivos: async (): Promise<Voluntario[]> => {
    const response = await api.get("/voluntarios/ativos");
    return response.data;
  },
};
