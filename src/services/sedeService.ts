import api from "./api";

export interface Sede {
  id: number;
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SedeCreateData {
  nome: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  ativo?: boolean;
}

export type SedeUpdateData = Partial<SedeCreateData>;

export interface SedeFilters {
  nome?: string;
  ativo?: boolean;
}

export interface SedeListResponse {
  data: Sede[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const sedeService = {
  // Listar sedes
  list: async (filters?: SedeFilters): Promise<SedeListResponse> => {
    const params = new URLSearchParams();

    if (filters?.nome) params.append("nome", filters.nome);
    if (filters?.ativo !== undefined)
      params.append("ativo", filters.ativo.toString());

    const response = await api.get(`/sedes?${params.toString()}`);
    return response.data;
  },

  // Listar sedes ativas (para select/dropdown)
  listAtivas: async (): Promise<Sede[]> => {
    const response = await api.get("/sedes?ativo=true&limit=100");
    return response.data.data;
  },

  // Buscar sede por ID
  getById: async (id: number): Promise<Sede> => {
    const response = await api.get(`/sedes/${id}`);
    return response.data;
  },

  // Criar nova sede
  create: async (data: SedeCreateData): Promise<Sede> => {
    const response = await api.post("/sedes", data);
    return response.data;
  },

  // Atualizar sede
  update: async (id: number, data: SedeUpdateData): Promise<Sede> => {
    const response = await api.patch(`/sedes/${id}`, data);
    return response.data;
  },

  // Excluir sede (soft delete)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sedes/${id}`);
  },

  // Ativar/desativar sede
  toggleStatus: async (id: number): Promise<Sede> => {
    const response = await api.patch(`/sedes/${id}/toggle-status`);
    return response.data;
  },
};
