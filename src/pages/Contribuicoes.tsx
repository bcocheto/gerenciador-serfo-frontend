import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type StatusContribuicao = "Pendente" | "Pago" | "Atrasado" | "Cancelado";

const statusColors: Record<StatusContribuicao, string> = {
  Pendente: "default",
  Pago: "default",
  Atrasado: "destructive",
  Cancelado: "secondary",
};

export default function Contribuicoes() {
  // Mock data - será substituído pela API real
  const contribuicoes = [
    {
      id: 1,
      pessoa: "João Silva",
      tipo: "Voluntário",
      valor: 150.00,
      vencimento: "2024-12-05",
      status: "Pago" as StatusContribuicao,
      dataPagamento: "2024-12-03",
    },
    {
      id: 2,
      pessoa: "Maria Santos",
      tipo: "Voluntário",
      valor: 200.00,
      vencimento: "2024-12-10",
      status: "Pendente" as StatusContribuicao,
      dataPagamento: null,
    },
    {
      id: 3,
      pessoa: "Carlos Oliveira",
      tipo: "Voluntário",
      valor: 180.00,
      vencimento: "2024-11-15",
      status: "Atrasado" as StatusContribuicao,
      dataPagamento: null,
    },
    {
      id: 4,
      pessoa: "Ana Paula Costa",
      tipo: "Assistido",
      valor: 100.00,
      vencimento: "2024-12-08",
      status: "Pago" as StatusContribuicao,
      dataPagamento: "2024-12-07",
    },
  ];

  const totalPendente = contribuicoes
    .filter((c) => c.status === "Pendente" || c.status === "Atrasado")
    .reduce((acc, c) => acc + c.valor, 0);

  const totalRecebido = contribuicoes
    .filter((c) => c.status === "Pago")
    .reduce((acc, c) => acc + c.valor, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contribuições</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as contribuições e contas a receber
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Gerar Mensais
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Contribuição
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              R$ {totalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {(totalPendente + totalRecebido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Contribuições</CardTitle>
              <CardDescription>
                {contribuicoes.length} contribuições registradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contribuição..."
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contribuicoes.map((contribuicao) => (
              <div
                key={contribuicao.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {contribuicao.pessoa}
                      </h3>
                      <Badge variant="outline">{contribuicao.tipo}</Badge>
                      <Badge variant={statusColors[contribuicao.status] as any}>
                        {contribuicao.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>
                        Vencimento:{" "}
                        {new Date(contribuicao.vencimento).toLocaleDateString("pt-BR")}
                      </span>
                      {contribuicao.dataPagamento && (
                        <span>
                          Pago em:{" "}
                          {new Date(contribuicao.dataPagamento).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      R$ {contribuicao.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {contribuicao.status === "Pendente" || contribuicao.status === "Atrasado" ? (
                      <Button size="sm">Processar Pagamento</Button>
                    ) : (
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
