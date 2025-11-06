import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, FileBarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Relatorios() {
  // Mock data para DRE Gerencial
  const dreData = [
    { mes: "Jan", receitas: 15000, despesas: 8000, resultado: 7000 },
    { mes: "Fev", receitas: 18000, despesas: 9500, resultado: 8500 },
    { mes: "Mar", receitas: 16500, despesas: 8800, resultado: 7700 },
    { mes: "Abr", receitas: 20000, despesas: 10200, resultado: 9800 },
    { mes: "Mai", receitas: 19000, despesas: 9800, resultado: 9200 },
    { mes: "Jun", receitas: 22000, despesas: 11000, resultado: 11000 },
  ];

  // Mock data para Projeção Financeira
  const projecaoData = [
    { mes: "Jul", realizado: 22000, projetado: 21000 },
    { mes: "Ago", realizado: 23500, projetado: 22000 },
    { mes: "Set", realizado: null, projetado: 23000 },
    { mes: "Out", realizado: null, projetado: 24000 },
    { mes: "Nov", realizado: null, projetado: 25000 },
    { mes: "Dez", realizado: null, projetado: 26000 },
  ];

  // Mock data para Distribuição de Receitas
  const distribuicaoReceitas = [
    { name: "Contribuições", value: 78450, color: "#2563EB" },
    { name: "Doações", value: 12300, color: "#10B981" },
    { name: "Eventos", value: 8900, color: "#F59E0B" },
    { name: "Outros", value: 3200, color: "#8B5CF6" },
  ];

  // Mock data para Inadimplência
  const inadimplenciaData = [
    {
      id: 1,
      pessoa: "Carlos Oliveira",
      valor: 180.00,
      diasAtraso: 30,
      ultimoContato: "2024-11-15",
    },
    {
      id: 2,
      pessoa: "Roberto Lima",
      valor: 150.00,
      diasAtraso: 15,
      ultimoContato: "2024-11-28",
    },
    {
      id: 3,
      pessoa: "Fernanda Rocha",
      valor: 200.00,
      diasAtraso: 45,
      ultimoContato: "2024-10-30",
    },
  ];

  const totalInadimplente = inadimplenciaData.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
        <p className="text-muted-foreground mt-1">
          Análises financeiras e dashboards gerenciais
        </p>
      </div>

      <Tabs defaultValue="dre" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dre">DRE Gerencial</TabsTrigger>
          <TabsTrigger value="projecao">Projeção Financeira</TabsTrigger>
          <TabsTrigger value="distribuicao">Distribuição</TabsTrigger>
          <TabsTrigger value="inadimplencia">Inadimplência</TabsTrigger>
        </TabsList>

        {/* DRE Gerencial */}
        <TabsContent value="dre" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">R$ 110.500</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Últimos 6 meses
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Despesa Total</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">R$ 57.300</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Últimos 6 meses
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resultado</CardTitle>
                <FileBarChart className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">R$ 53.200</div>
                <p className="text-xs text-success mt-1">+92.9% positivo</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Evolução Mensal - DRE</CardTitle>
              <CardDescription>
                Comparativo de receitas, despesas e resultado nos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      `R$ ${Number(value).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}`
                    }
                  />
                  <Legend />
                  <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                  <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                  <Bar dataKey="resultado" fill="#2563EB" name="Resultado" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projeção Financeira */}
        <TabsContent value="projecao" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Projeção Financeira</CardTitle>
              <CardDescription>
                Comparação entre valores realizados e projetados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={projecaoData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      value
                        ? `R$ ${Number(value).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}`
                        : "N/A"
                    }
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="realizado"
                    stroke="#2563EB"
                    strokeWidth={2}
                    name="Realizado"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="projetado"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Projetado"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Análise de Tendência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Crescimento Médio</span>
                  <span className="text-sm font-bold text-success">+6.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Meta Anual</span>
                  <span className="text-sm font-bold text-foreground">R$ 280.000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Atingido</span>
                  <span className="text-sm font-bold text-primary">68.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-success/50">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Previsão para Dezembro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-foreground">R$ 26.000</div>
                <p className="text-sm text-muted-foreground">
                  Baseado na média dos últimos 6 meses
                </p>
                <Badge variant="default">Tendência Positiva</Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distribuição de Receitas */}
        <TabsContent value="distribuicao" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Distribuição de Receitas por Categoria</CardTitle>
              <CardDescription>
                Composição das receitas por fonte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={distribuicaoReceitas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {distribuicaoReceitas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `R$ ${Number(value).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="space-y-4">
                  {distribuicaoReceitas.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold">
                        R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">
                        R${" "}
                        {distribuicaoReceitas
                          .reduce((acc, item) => acc + item.value, 0)
                          .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório de Inadimplência */}
        <TabsContent value="inadimplencia" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm border-warning/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Inadimplente</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  R$ {totalInadimplente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {inadimplenciaData.length} contribuições em atraso
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Inadimplência</CardTitle>
                <TrendingDown className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">12.5%</div>
                <p className="text-xs text-warning mt-1">Requer atenção</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Atraso Médio</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">30 dias</div>
                <p className="text-xs text-muted-foreground mt-1">Média geral</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Contribuições em Atraso</CardTitle>
              <CardDescription>
                Lista de contribuições que requerem ação de cobrança
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {inadimplenciaData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">{item.pessoa}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>
                          Último contato:{" "}
                          {new Date(item.ultimoContato).toLocaleDateString("pt-BR")}
                        </span>
                        <Badge
                          variant={
                            item.diasAtraso > 30 ? "destructive" : "secondary"
                          }
                        >
                          {item.diasAtraso} dias em atraso
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-warning">
                          R${" "}
                          {item.valor.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
