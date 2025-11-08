import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Mail, Phone, Loader2, AlertCircle, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assistidoService, AssistidoFilters, Assistido } from "@/services/assistidoService";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";


export default function Assistidos() {
  const [filters, setFilters] = useState<AssistidoFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: undefined,
    orderBy: 'nome',
    orderDirection: 'asc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAssistido, setSelectedAssistido] = useState<Assistido | undefined>();
  const [isEdit, setIsEdit] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar assistidos
  const {
    data: assistidosData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['assistidos', filters],
    queryFn: () => assistidoService.getAssistidos(filters),
  });

  // Mutations para ações
  const inativarMutation = useMutation({
    mutationFn: assistidoService.inativarAssistido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistidos'] });
      toast({
        title: "Assistido inativado",
        description: "O assistido foi inativado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao inativar assistido.",
        variant: "destructive",
      });
    },
  });

  const reativarMutation = useMutation({
    mutationFn: assistidoService.reativarAssistido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistidos'] });
      toast({
        title: "Assistido reativado",
        description: "O assistido foi reativado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao reativar assistido.",
        variant: "destructive",
      });
    },
  });

  // Handlers
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setFilters(prev => ({ ...prev, search: term, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status as 'ativo' | 'inativo',
      page: 1
    }));
  };

  const handleInativarAssistido = (id: string) => {
    inativarMutation.mutate(id);
  };

  const handleReativarAssistido = (id: string) => {
    reativarMutation.mutate(id);
  };

  const handleEditAssistido = (assistido: Assistido) => {
    setSelectedAssistido(assistido);
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleNewAssistido = () => {
    setSelectedAssistido(undefined);
    setIsEdit(false);
    setDialogOpen(true);
  };

  const assistidos = assistidosData?.data || [];
  const totalCount = assistidosData?.meta?.total || 0;

  // Tratamento de erros
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assistidos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os assistidos pela organização
            </p>
          </div>
          <Button onClick={handleNewAssistido}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Assistido
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar assistidos. Verifique se a API está funcionando e tente novamente.
          </AlertDescription>
        </Alert>
        <Button onClick={() => refetch()}>
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assistidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os assistidos pela organização
          </p>
        </div>
        <Button onClick={handleNewAssistido}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Assistido
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Assistidos</CardTitle>
              <CardDescription>
                {totalCount} assistidos cadastrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativos</SelectItem>
                  <SelectItem value="inativo">Inativos</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar assistido..."
                  className="pl-10 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando assistidos...</span>
            </div>
          ) : assistidos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum assistido encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assistidos.map((assistido) => (
                <div
                  key={assistido.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {assistido.nome}
                        </h3>
                        <Badge variant={assistido.status === 'ativo' ? "default" : "secondary"}>
                          {assistido.status === 'ativo' ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        {assistido.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {assistido.email}
                          </div>
                        )}
                        {assistido.telefone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {assistido.telefone}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        CPF: {assistido.cpf} • RG: {assistido.rg} • Início:{" "}
                        {new Date(assistido.dataInicio).toLocaleDateString("pt-BR")}
                      </p>
                      {assistido.situacaoSocial && (
                        <p className="text-xs text-muted-foreground">
                          Situação: {assistido.situacaoSocial}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditAssistido(assistido)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            assistido.status === 'ativo'
                              ? handleInativarAssistido(assistido.id)
                              : handleReativarAssistido(assistido.id)
                          }
                        >
                          {assistido.status === 'ativo' ? 'Inativar' : 'Reativar'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
