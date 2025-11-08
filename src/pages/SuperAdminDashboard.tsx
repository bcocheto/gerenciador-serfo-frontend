import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Building,
  UserCheck,
  Settings,
  Activity,
  Database,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { superAdminService, SuperAdminDashboard } from "@/services/superAdminService";

export default function SuperAdminDashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["super-admin", "dashboard", refreshKey],
    queryFn: superAdminService.getDashboard,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard Super Admin</h1>
            <p className="text-muted-foreground">Visão geral completa do sistema</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Erro ao carregar dados</h3>
          <p className="text-muted-foreground">Não foi possível carregar as informações do dashboard</p>
          <Button onClick={handleRefresh} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Super Administrador</h1>
          </div>
          <p className="text-muted-foreground">Controle total do sistema - Use com responsabilidade</p>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedes</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.sedes.total}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">
                {dashboardData.sedes.ativas} ativas
              </Badge>
              {dashboardData.sedes.inativas > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {dashboardData.sedes.inativas} inativas
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voluntários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.voluntarios.total}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">
                {dashboardData.voluntarios.ativos} ativos
              </Badge>
              {dashboardData.voluntarios.inativos > 0 && (
                <Badge variant="outline" className="text-xs">
                  {dashboardData.voluntarios.inativos} inativos
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assistidos</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.assistidos.total}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <Badge variant="secondary" className="text-xs">
                {dashboardData.assistidos.ativos} ativos
              </Badge>
              {dashboardData.assistidos.inativos > 0 && (
                <Badge variant="outline" className="text-xs">
                  {dashboardData.assistidos.inativos} inativos
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detalhes por Sede */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estatísticas por Sede
          </CardTitle>
          <CardDescription>
            Distribuição de usuários e assistidos em todas as sedes do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.statsPorSede.map((sede) => (
              <div key={sede.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{sede.nome}</span>
                  </div>
                  <Badge variant={sede.ativo ? "secondary" : "outline"}>
                    {sede.ativo ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {sede.voluntarios} voluntários
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="h-3 w-3" />
                    {sede.assistidos} assistidos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ações de Administração
          </CardTitle>
          <CardDescription>
            Acesso rápido às principais funcionalidades administrativas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/super-admin/users">
                <Users className="h-6 w-6" />
                Gerenciar Usuários
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/super-admin/assistidos">
                <UserCheck className="h-6 w-6" />
                Gerenciar Assistidos
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/super-admin/sedes">
                <Building className="h-6 w-6" />
                Gerenciar Sedes
              </a>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" asChild>
              <a href="/super-admin/logs">
                <Activity className="h-6 w-6" />
                Logs do Sistema
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-red-500" />
          Você está usando privilégios de Super Administrador
        </p>
      </div>
    </div>
  );
}