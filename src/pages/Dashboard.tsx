import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Users, Receipt } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  // Mock data - será substituído pela API real
  const stats = {
    saldoLiquido: 45320.50,
    totalReceitas: 78450.00,
    totalDespesas: 33129.50,
    inadimplencia: 12.5,
    voluntariosAtivos: 156,
    assistidosAtivos: 89,
    notasPendentes: 23,
  };

  const recentActivities = [
    { id: 1, descricao: "Pagamento recebido - João Silva", valor: 150.00, tipo: "receita" },
    { id: 2, descricao: "Despesa - Manutenção do prédio", valor: -850.00, tipo: "despesa" },
    { id: 3, descricao: "Pagamento recebido - Maria Santos", valor: 200.00, tipo: "receita" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo(a), {user?.nome}
        </p>
      </div>

      {/* Cards de Resumo Financeiro */}
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
            <p className="text-xs text-success flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% em relação ao mês anterior
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
              Requer atenção
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards de Estatísticas Gerais */}
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
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
          <CardDescription>Últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
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
                  <span className="text-sm font-medium">{activity.descricao}</span>
                </div>
                <span className={`text-sm font-bold ${activity.tipo === "receita" ? "text-success" : "text-destructive"}`}>
                  {activity.tipo === "receita" ? "+" : "-"}R$ {Math.abs(activity.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
