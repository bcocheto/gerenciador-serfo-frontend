import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Users, Receipt, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { relatorioService } from "@/services/relatorioService";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Dashboard() {
  const { user } = useAuth();

  // Buscar dados do dashboard
  const {
    data: stats,
    isLoading: isLoadingStats,
    error: errorStats
  } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: relatorioService.getDashboardStats,
    refetchInterval: 5 * 60 * 1000, // Refetch a cada 5 minutos
  });

  // Buscar atividades recentes
  const {
    data: recentActivities,
    isLoading: isLoadingActivities,
    error: errorActivities
  } = useQuery({
    queryKey: ['atividades-recentes'],
    queryFn: () => relatorioService.getAtividadesRecentes(5),
    refetchInterval: 2 * 60 * 1000, // Refetch a cada 2 minutos
  });

  // Estados de loading
  const isLoading = isLoadingStats || isLoadingActivities;
  const hasError = errorStats || errorActivities;

  // Tratamento de erros
  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo(a), {user?.nome}
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar dados do dashboard. Verifique se a API está funcionando e tente novamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo(a), {user?.nome}
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados...</span>
        </div>
      )}

      {/* Cards de Resumo Financeiro */}
      {!isLoading && stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats.saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.saldoLiquido >= 0 ? (
                  <span className="text-success flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Saldo positivo
                  </span>
                ) : (
                  <span className="text-destructive flex items-center">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    Saldo negativo
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats.totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mês atual
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                R$ {stats.totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Mês atual
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-warning/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Inadimplência</CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.inadimplencia}%
              </div>
              <p className="text-xs text-warning mt-1">
                {stats.inadimplencia > 10 ? "Requer atenção" : "Dentro do esperado"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cards de Estatísticas Gerais */}
      {!isLoading && stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voluntários Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.voluntariosAtivos}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assistidos Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.assistidosAtivos}</div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notas Pendentes</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.notasPendentes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.notasPendentes > 0 ? `${stats.notasPendentes} aguardando processamento` : "Nenhuma pendência"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Atividades Recentes */}
      {!isLoading && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas movimentações financeiras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      {activity.tipo === "receita" ? (
                        <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-success" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium block">{activity.descricao}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.data).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${activity.tipo === "receita" ? "text-success" : "text-destructive"}`}>
                      {activity.tipo === "receita" ? "+" : ""}R$ {activity.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma atividade recente encontrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
