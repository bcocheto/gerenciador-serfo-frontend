import api from "./api";
import { BaseFilters, PaginatedResponse, Status } from "@/types/api";

export interface Assistido {
  id: string;
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  endereco: string;
  telefone?: string;
  email?: string;
  responsavelNome?: string;
  responsavelTelefone?: string;
  responsavelParentesco?: string;
  situacaoSocial: string;
  observacoes?: string;
  dataInicio: string;
  status: Status;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CreateAssistidoRequest {
  nome: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  endereco: string;
  telefone?: string;
  email?: string;
  responsavelNome?: string;
  responsavelTelefone?: string;
  responsavelParentesco?: string;
  situacaoSocial: string;
  observacoes?: string;
  dataInicio: string;
}

export interface UpdateAssistidoRequest
  extends Partial<CreateAssistidoRequest> {
  status?: Status;
}

export interface AssistidoFilters extends BaseFilters {
  status?: Status;
  dataInicioInicio?: string;
  dataInicioFim?: string;
  situacaoSocial?: string;
}

export const assistidoService = {
  // Listar assistidos com paginação e filtros
  getAssistidos: async (
    filters: AssistidoFilters = {}
  ): Promise<PaginatedResponse<Assistido>> => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/assistidos?${params.toString()}`);
    return response.data;
  },

  // Buscar assistido por ID
  getAssistidoById: async (id: string): Promise<Assistido> => {
    const response = await api.get(`/assistidos/${id}`);
    return response.data;
  },

  // Criar novo assistido
  createAssistido: async (data: CreateAssistidoRequest): Promise<Assistido> => {
    const response = await api.post("/assistidos", data);
    return response.data;
  },

  // Atualizar assistido
  updateAssistido: async (
    id: string,
    data: UpdateAssistidoRequest
  ): Promise<Assistido> => {
    const response = await api.put(`/assistidos/${id}`, data);
    return response.data;
  },

  // Inativar assistido
  inativarAssistido: async (id: string): Promise<void> => {
    await api.patch(`/assistidos/${id}/inativar`);
  },

  // Reativar assistido
  reativarAssistido: async (id: string): Promise<void> => {
    await api.patch(`/assistidos/${id}/reativar`);
  },

  // Excluir assistido (soft delete)
  deleteAssistido: async (id: string): Promise<void> => {
    await api.delete(`/assistidos/${id}`);
  },

  // Buscar assistidos ativos para seleção
  getAssistidosAtivos: async (): Promise<Assistido[]> => {
    const response = await api.get("/assistidos/ativos");
    return response.data;
  },
};
