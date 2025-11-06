import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, TrendingUp, TrendingDown, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TipoMovimentacao = "Receita" | "Despesa";

export default function Movimentacoes() {
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");

  // Mock data - será substituído pela API real
  const movimentacoes = [
    {
      id: 1,
      descricao: "Pagamento de Contribuição - João Silva",
      tipo: "Receita" as TipoMovimentacao,
      valor: 150.00,
      data: "2024-12-03",
      categoria: "Contribuições",
      metodoPagamento: "PIX",
    },
    {
      id: 2,
      descricao: "Pagamento de Luz",
      tipo: "Despesa" as TipoMovimentacao,
      valor: 450.00,
      data: "2024-12-05",
      categoria: "Despesas Operacionais",
      metodoPagamento: "Débito Automático",
    },
    {
      id: 3,
      descricao: "Pagamento de Contribuição - Maria Santos",
      tipo: "Receita" as TipoMovimentacao,
      valor: 200.00,
      data: "2024-12-07",
      categoria: "Contribuições",
      metodoPagamento: "Transferência Bancária",
    },
    {
      id: 4,
      descricao: "Compra de Material de Escritório",
      tipo: "Despesa" as TipoMovimentacao,
      valor: 320.50,
      data: "2024-12-08",
      categoria: "Material",
      metodoPagamento: "Cartão de Crédito",
    },
    {
      id: 5,
      descricao: "Doação Externa",
      tipo: "Receita" as TipoMovimentacao,
      valor: 1000.00,
      data: "2024-12-10",
      categoria: "Doações",
      metodoPagamento: "PIX",
    },
    {
      id: 6,
      descricao: "Manutenção do Prédio",
      tipo: "Despesa" as TipoMovimentacao,
      valor: 850.00,
      data: "2024-12-12",
      categoria: "Manutenção",
      metodoPagamento: "Transferência Bancária",
    },
  ];

  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    if (filtroTipo === "todos") return true;
    return m.tipo === filtroTipo;
  });

  const totalReceitas = movimentacoes
    .filter((m) => m.tipo === "Receita")
    .reduce((acc, m) => acc + m.valor, 0);

  const totalDespesas = movimentacoes
    .filter((m) => m.tipo === "Despesa")
    .reduce((acc, m) => acc + m.valor, 0);

  const saldoLiquido = totalReceitas - totalDespesas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movimentações</h1>
          <p className="text-muted-foreground mt-1">
            Extrato completo de receitas e despesas
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Movimentação
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalReceitas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R$ {totalDespesas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Líquido</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${saldoLiquido >= 0 ? "text-success" : "text-destructive"}`}>
              R$ {saldoLiquido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Extrato Financeiro</CardTitle>
              <CardDescription>
                {movimentacoesFiltradas.length} movimentações registradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Receita">Receitas</SelectItem>
                  <SelectItem value="Despesa">Despesas</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar movimentação..."
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {movimentacoesFiltradas.map((mov) => (
              <div
                key={mov.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {mov.tipo === "Receita" ? (
                    <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-success" />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <TrendingDown className="h-6 w-6 text-destructive" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {mov.descricao}
                      </h3>
                      <Badge variant={mov.tipo === "Receita" ? "default" : "secondary"}>
                        {mov.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{mov.categoria}</span>
                      <span>•</span>
                      <span>{mov.metodoPagamento}</span>
                      <span>•</span>
                      <span>
                        {new Date(mov.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${mov.tipo === "Receita" ? "text-success" : "text-destructive"}`}>
                      {mov.tipo === "Receita" ? "+" : "-"}R${" "}
                      {mov.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
