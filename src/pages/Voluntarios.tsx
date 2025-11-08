import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck, Mail, Phone, Loader2, AlertCircle, Filter, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { voluntarioService, VoluntarioFilters } from "@/services/voluntarioService";
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
import { VoluntarioDialog } from "@/components/forms/VoluntarioDialog";
import { Voluntario } from "@/services/voluntarioService"; export default function Voluntarios() {
  const [filters, setFilters] = useState<VoluntarioFilters>({
    page: 1,
    limit: 20,
    search: '',
    status: undefined,
    orderBy: 'nome',
    orderDirection: 'asc'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | undefined>();
  const [isEdit, setIsEdit] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar voluntários
  const {
    data: voluntariosData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['voluntarios', filters],
    queryFn: () => voluntarioService.getVoluntarios(filters),
  });

  // Mutations para ações
  const inativarMutation = useMutation({
    mutationFn: voluntarioService.inativarVoluntario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: "Voluntário inativado",
        description: "O voluntário foi inativado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao inativar voluntário.",
        variant: "destructive",
      });
    },
  });

  const reativarMutation = useMutation({
    mutationFn: voluntarioService.reativarVoluntario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: "Voluntário reativado",
        description: "O voluntário foi reativado com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao reativar voluntário.",
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

  const handleInativarVoluntario = (id: string) => {
    inativarMutation.mutate(id);
  };

  const handleReativarVoluntario = (id: string) => {
    reativarMutation.mutate(id);
  };

  const handleEditVoluntario = (voluntario: Voluntario) => {
    setSelectedVoluntario(voluntario);
    setIsEdit(true);
    setDialogOpen(true);
  };

  const handleNewVoluntario = () => {
    setSelectedVoluntario(undefined);
    setIsEdit(false);
    setDialogOpen(true);
  };

  const voluntarios = voluntariosData?.data || [];
  const totalCount = voluntariosData?.meta?.total || 0;

  // Tratamento de erro
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Voluntários</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie os voluntários da organização
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Voluntário
          </Button>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar voluntários. Verifique se a API está funcionando e tente novamente.
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
          <h1 className="text-3xl font-bold text-foreground">Voluntários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os voluntários da organização
          </p>
        </div>
        <Button onClick={handleNewVoluntario}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Voluntário
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Voluntários</CardTitle>
              <CardDescription>
                {totalCount} voluntários cadastrados
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
                  placeholder="Buscar voluntário..."
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
              <span className="ml-2">Carregando voluntários...</span>
            </div>
          ) : voluntarios.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UserCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhum voluntário encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {voluntarios.map((voluntario) => (
                <div
                  key={voluntario.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {voluntario.nome}
                        </h3>
                        <Badge variant={voluntario.status === 'ativo' ? "default" : "secondary"}>
                          {voluntario.status === 'ativo' ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {voluntario.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {voluntario.telefone}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Data de Ingresso:{" "}
                        {new Date(voluntario.dataIngresso).toLocaleDateString("pt-BR")}
                        {voluntario.observacoes && ` • ${voluntario.observacoes}`}
                      </p>
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
                        <DropdownMenuItem onClick={() => handleEditVoluntario(voluntario)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            voluntario.status === 'ativo'
                              ? handleInativarVoluntario(voluntario.id)
                              : handleReativarVoluntario(voluntario.id)
                          }
                        >
                          {voluntario.status === 'ativo' ? 'Inativar' : 'Reativar'}
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

      <VoluntarioDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        voluntario={selectedVoluntario}
        isEdit={isEdit}
      />
    </div>
  );
}
