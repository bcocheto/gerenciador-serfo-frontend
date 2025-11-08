import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  MapPin,
  Calendar,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { superAdminService, SuperAdminSede } from "@/services/superAdminService";
import { Assistido } from "@/services/assistidoService";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/errorHandling";



const SuperAdminAssistidos: React.FC = () => {
  const [assistidos, setAssistidos] = useState<Assistido[]>([]);
  const [sedes, setSedes] = useState<SuperAdminSede[]>([]);
  const [filteredAssistidos, setFilteredAssistidos] = useState<Assistido[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSede, setSelectedSede] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    filterAssistidos();
  }, [assistidos, searchTerm, selectedSede]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar assistidos e sedes
      const [assistidosData, sedesData] = await Promise.all([
        superAdminService.getAllAssistidos(),
        superAdminService.getAllSedes()
      ]);

      setAssistidos(assistidosData);
      setSedes(sedesData);
    } catch (error) {
      const errorMessage = extractErrorMessage(error, "Erro ao carregar dados dos assistidos.");

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAssistidos = () => {
    let filtered = assistidos;

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(assistido => {
        const sedeNome = assistido.sede?.nome || '';
        // Buscar cidade da sede pelos dados das sedes carregadas
        const sede = sedes.find(s => s.id === assistido.sedeId);
        const sedeCidade = sede?.cidade || '';

        return assistido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (assistido.cpf && assistido.cpf.includes(searchTerm)) ||
          (assistido.telefone && assistido.telefone.includes(searchTerm)) ||
          sedeNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sedeCidade.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Filtrar por sede
    if (selectedSede !== 'all') {
      filtered = filtered.filter(assistido => assistido.sedeId.toString() === selectedSede);
    }

    setFilteredAssistidos(filtered);
  };

  const handleDeleteAssistido = async (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o assistido "${nome}"?`)) {
      try {
        await superAdminService.deleteAssistido(parseInt(id));
        toast({
          title: "Sucesso",
          description: `Assistido "${nome}" excluído com sucesso.`,
        });
        loadData();
      } catch (error) {
        const errorMessage = extractErrorMessage(error, `Erro ao excluir assistido "${nome}".`);

        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive",
        });
        console.error('Erro ao excluir assistido:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string | null | undefined) => {
    if (!cpf) {
      return 'Não informado';
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string | null | undefined) => {
    if (!phone) {
      return 'Não informado';
    }
    if (phone.length === 11) {
      return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (phone.length === 10) {
      return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando assistidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Assistidos</h1>
          <p className="text-muted-foreground">
            Gerencie todos os assistidos do sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Assistido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Assistidos
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assistidos.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sedes com Assistidos
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(assistidos.map(a => a.sedeId)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assistidos Filtrados
            </CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredAssistidos.length}</div>
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
                placeholder="Buscar por nome, CPF, telefone, sede ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
                className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todas as Sedes</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id.toString()}>
                    {sede.nome} - {sede.cidade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assistidos List */}
      <Card>
        <CardHeader>
          <CardTitle>Assistidos ({filteredAssistidos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAssistidos.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum assistido encontrado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssistidos.map((assistido) => (
                <Card key={assistido.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{assistido.nome}</h3>
                        <Badge variant="outline">
                          {assistido.sede.nome}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <span className="font-medium mr-2">CPF:</span>
                          {formatCPF(assistido.cpf)}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Telefone:</span>
                          {formatPhone(assistido.telefone)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {(() => {
                            const sede = sedes.find(s => s.id === assistido.sedeId);
                            return sede?.cidade || 'Cidade não informada';
                          })()}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(assistido.criadoEm)}
                        </div>
                      </div>

                      {assistido.endereco && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Endereço:</span> {assistido.endereco}
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteAssistido(assistido.id, assistido.nome)}
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

export default SuperAdminAssistidos;