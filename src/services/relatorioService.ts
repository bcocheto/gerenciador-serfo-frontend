import api from "./api";

export interface DashboardStats {
  resumoFinanceiro: {
    saldoLiquido: number;
    totalReceitas: string | number;
    totalDespesas: number;
    qtdEntradas: number;
    qtdSaidas: number;
  };
  pessoas: {
    voluntariosAtivos: number;
    assistidosAtivos: number;
  };
  contribuicoes: {
    total: number;
    pendentes: number;
    pagas: number;
    atrasadas: number;
    valorTotalPago: number;
    taxaAdimplencia: string;
  };
  categorias: Record<string, { entradas: number; saidas: number }>;
  contas: Record<string, { entradas: number; saidas: number }>;
  movimentacoesRecentes: Array<{
    id: number;
    data: string;
    descricao: string;
    valor: string | number;
    tipo: string;
    categoria: string;
    conta: string;
  }>;
}

export interface ResumoFinanceiro {
  totalReceitas: number;
  totalDespesas: number;
  saldoLiquido: number;
  receitasPorCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
  despesasPorCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
}

export interface AtividadeRecente {
  id: string;
  descricao: string;
  valor: number | null;
  tipo:
    | "receita"
    | "despesa"
    | "voluntario_cadastrado"
    | "assistido_cadastrado"
    | "contribuicao_recebida";
  data: string;
  categoria?: string;
  sede?: string | null;
}

export interface ComparativoMensal {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

export const relatorioService = {
  // Buscar dados do dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/relatorios/dashboard");
    return response.data.data || response.data;
  },

  // Buscar resumo financeiro
  getResumoFinanceiro: async (
    dataInicio?: string,
    dataFim?: string
  ): Promise<ResumoFinanceiro> => {
    const params = new URLSearchParams();
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    const response = await api.get(
      `/relatorios/resumo-financeiro?${params.toString()}`
    );
    return response.data;
  },

  // Buscar atividades recentes
  getAtividadesRecentes: async (
    limite: number = 10
  ): Promise<AtividadeRecente[]> => {
    const response = await api.get(
      `/relatorios/atividades-recentes?limite=${limite}`
    );
    return response.data.data || response.data;
  },

  // Buscar comparativo mensal
  getComparativoMensal: async (ano?: number): Promise<ComparativoMensal[]> => {
    const params = new URLSearchParams();
    if (ano) params.append("ano", ano.toString());

    const response = await api.get(
      `/relatorios/comparativo-mensal?${params.toString()}`
    );
    return response.data;
  },

  // Gerar relatório de inadimplência
  getRelatorioInadimplencia: async (dataInicio?: string, dataFim?: string) => {
    const params = new URLSearchParams();
    if (dataInicio) params.append("dataInicio", dataInicio);
    if (dataFim) params.append("dataFim", dataFim);

    const response = await api.get(
      `/relatorios/inadimplencia?${params.toString()}`
    );
    return response.data;
  },

  // Exportar relatório em PDF
  exportarRelatorioPDF: async (
    tipo: string,
    parametros?: Record<string, string>
  ) => {
    const params = new URLSearchParams(parametros);
    const response = await api.get(
      `/relatorios/exportar/${tipo}?${params.toString()}`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  },
};
