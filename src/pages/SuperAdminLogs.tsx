import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Search,
  Filter,
  Calendar,
  User,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Interface temporária para logs (seria implementada no backend)
interface LogEntry {
  id: number;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  userId?: number;
  userName?: string;
  sedeId?: number;
  sedeName?: string;
  details: string;
  ip?: string;
  userAgent?: string;
}

const SuperAdminLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, levelFilter, dateFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLogs = async () => {
    try {
      setLoading(true);

      // Simulação de logs (em uma implementação real, viria do backend)
      const mockLogs: LogEntry[] = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          level: 'info',
          action: 'LOGIN',
          userId: 1,
          userName: 'Super Admin',
          details: 'Login realizado com sucesso',
          ip: '192.168.1.100'
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          level: 'success',
          action: 'USER_CREATED',
          userId: 1,
          userName: 'Super Admin',
          sedeId: 1,
          sedeName: 'Sede Principal',
          details: 'Novo usuário criado: João Silva',
          ip: '192.168.1.100'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          level: 'warning',
          action: 'FAILED_LOGIN',
          details: 'Tentativa de login com credenciais inválidas para: usuario@teste.com',
          ip: '192.168.1.200'
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          level: 'error',
          action: 'DATABASE_ERROR',
          details: 'Erro de conexão com o banco de dados',
          ip: 'localhost'
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
          level: 'info',
          action: 'ASSISTIDO_CREATED',
          userId: 2,
          userName: 'Maria Santos',
          sedeId: 2,
          sedeName: 'Sede Filial',
          details: 'Novo assistido cadastrado: Pedro Oliveira',
          ip: '192.168.1.150'
        }
      ];

      setLogs(mockLogs);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar logs do sistema.",
        variant: "destructive",
      });
      console.error('Erro ao carregar logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.sedeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip?.includes(searchTerm)
      );
    }

    // Filtrar por nível
    if (levelFilter !== 'all') {
      filtered = filtered.filter(log => log.level === levelFilter);
    }

    // Filtrar por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(startOfDay.getTime() - (now.getDay() * 24 * 60 * 60 * 1000));

      filtered = filtered.filter(log => {
        const logDate = new Date(log.timestamp);
        switch (dateFilter) {
          case 'today':
            return logDate >= startOfDay;
          case 'week':
            return logDate >= startOfWeek;
          case 'month': {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return logDate >= startOfMonth;
          }
          default:
            return true;
        }
      });
    }

    setFilteredLogs(filtered);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLevelBadge = (level: string) => {
    const variants = {
      info: 'default' as const,
      warning: 'secondary' as const,
      error: 'destructive' as const,
      success: 'default' as const
    };

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Logs do Sistema</h1>
          <p className="text-muted-foreground">
            Monitor de atividades e eventos do sistema
          </p>
        </div>
        <Button onClick={loadLogs} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Logs
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Erros
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {logs.filter(l => l.level === 'error').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avisos
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {logs.filter(l => l.level === 'warning').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Filtrados
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredLogs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ação, detalhes, usuário, sede ou IP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full lg:w-40">
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos os Níveis</option>
                <option value="info">Info</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="error">Erro</option>
              </select>
            </div>
            <div className="w-full lg:w-40">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todas as Datas</option>
                <option value="today">Hoje</option>
                <option value="week">Esta Semana</option>
                <option value="month">Este Mês</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum log encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getLevelIcon(log.level)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{log.action}</span>
                          {getLevelBadge(log.level)}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-foreground mb-2">
                        {log.details}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-muted-foreground">
                        {log.userName && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {log.userName}
                          </div>
                        )}
                        {log.sedeName && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {log.sedeName}
                          </div>
                        )}
                        {log.ip && (
                          <div>
                            <span className="font-medium">IP:</span> {log.ip}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">ID:</span> #{log.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuperAdminLogs;