import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Search,
  MapPin,
  Users,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Building
} from "lucide-react";
import { superAdminService } from "@/services/superAdminService";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage, isDependencyConflictError } from "@/lib/errorHandling";

interface Sede {
  id: number;
  nome: string;
  endereco: string;
  cidade: string;
  cep: string;
  telefone: string;
  email: string;
  isAtiva: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    voluntarios: number;
    assistidos: number;
  };
}

const SuperAdminSedes: React.FC = () => {
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filteredSedes, setFilteredSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadSedes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterSedes();
  }, [sedes, searchTerm, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadSedes = async () => {
    try {
      setLoading(true);
      const data = await superAdminService.getAllSedes();
      setSedes(data);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Erro ao carregar dados das sedes.");

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Erro ao carregar sedes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSedes = () => {
    let filtered = sedes;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(sede =>
        sede.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.telefone.includes(searchTerm) ||
        sede.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sede =>
        statusFilter === 'active' ? sede.isAtiva : !sede.isAtiva
      );
    }

    setFilteredSedes(filtered);
  };

  const handleToggleSedeStatus = async (id: number, nome: string, isAtiva: boolean) => {
    try {
      await superAdminService.updateSede(id, { isAtiva: !isAtiva });
      toast({
        title: "Sucesso",
        description: `Sede "${nome}" ${!isAtiva ? 'ativada' : 'desativada'} com sucesso.`,
      });
      loadSedes();
    } catch (error) {
      const errorMessage = extractErrorMessage(
        error,
        `Erro ao ${!isAtiva ? 'ativar' : 'desativar'} sede "${nome}".`
      );

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Erro ao alterar status da sede:', error);
    }
  };

  const handleDeleteSede = async (id: number, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a sede "${nome}"? Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.`)) {
      try {
        await superAdminService.deleteSede(id);
        toast({
          title: "Sucesso",
          description: `Sede "${nome}" excluída com sucesso.`,
        });
        loadSedes();
      } catch (error) {
        const errorMessage = extractErrorMessage(error, `Erro ao excluir sede "${nome}".`);

        // Verificar se é erro de dependência para dar uma mensagem mais clara
        const isDependencyError = isDependencyConflictError(error);

        toast({
          title: isDependencyError ? "Não é possível excluir sede" : "Erro ao excluir sede",
          description: errorMessage,
          variant: "destructive",
        });
        console.error('Erro ao excluir sede:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPhone = (phone: string) => {
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const totalUsuarios = sedes.reduce((sum, sede) => sum + sede._count.voluntarios, 0);
  const totalAssistidos = sedes.reduce((sum, sede) => sum + sede._count.assistidos, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sedes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Sedes</h1>
          <p className="text-muted-foreground">
            Gerencie todas as sedes do sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Sede
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Sedes
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sedes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sedes Ativas
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sedes.filter(s => s.isAtiva).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Usuários
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsuarios}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Assistidos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssistidos}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, cidade, endereço, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos os Status</option>
                <option value="active">Apenas Ativas</option>
                <option value="inactive">Apenas Inativas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sedes List */}
      <Card>
        <CardHeader>
          <CardTitle>Sedes ({filteredSedes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredSedes.length === 0 ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma sede encontrada.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSedes.map((sede) => (
                <Card key={sede.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{sede.nome}</h3>
                        <Badge variant={sede.isAtiva ? "default" : "secondary"}>
                          {sede.isAtiva ? "Ativa" : "Inativa"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {sede.cidade}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(sede.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Telefone:</span> {formatPhone(sede.telefone)}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {sede.email}
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Endereço:</span> {sede.endereco}, CEP: {sede.cep}
                      </div>

                      <div className="flex space-x-4 text-sm">
                        <Badge variant="outline">
                          {sede._count.voluntarios} usuários
                        </Badge>
                        <Badge variant="outline">
                          {sede._count.assistidos} assistidos
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleSedeStatus(sede.id, sede.nome, sede.isAtiva)}
                      >
                        {sede.isAtiva ? "Desativar" : "Ativar"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSede(sede.id, sede.nome)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
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

export default SuperAdminSedes;