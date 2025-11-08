import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Filter,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { superAdminService, SuperAdminFilters } from "@/services/superAdminService";
import { sedeService } from "@/services/sedeService";
import { Voluntario } from "@/services/voluntarioService";

const cargoLabels = {
  VOLUNTARIO: "Voluntário",
  SECRETARIO: "Secretário",
  TESOUREIRO: "Tesoureiro",
  PRESIDENTE: "Presidente",
  SUPER_ADMIN: "Super Administrador",
};

export default function SuperAdminUsers() {
  const [filters, setFilters] = useState<SuperAdminFilters>({});
  const [selectedUser, setSelectedUser] = useState<Voluntario | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar usuários
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["super-admin", "users", filters],
    queryFn: () => superAdminService.getAllUsers(filters),
  });

  // Buscar sedes para filtros e transferências
  const { data: sedes = [] } = useQuery({
    queryKey: ["sedes", "ativas"],
    queryFn: () => sedeService.listAtivas(),
  });

  // Mutation para deletar usuário
  const deleteUserMutation = useMutation({
    mutationFn: superAdminService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      toast({
        title: "Usuário excluído",
        description: "Usuário excluído com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário.",
        variant: "destructive",
      });
    },
  });

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search, page: 1 }));
  };

  const handleSedeFilter = (sedeId: string) => {
    setFilters(prev => ({
      ...prev,
      sedeId: sedeId === "all" ? undefined : parseInt(sedeId),
      page: 1
    }));
  };

  const handleCargoFilter = (cargo: string) => {
    setFilters(prev => ({
      ...prev,
      cargo: cargo === "all" ? undefined : cargo,
      page: 1
    }));
  };

  const handleDeleteUser = async (user: Voluntario) => {
    if (user.cargo === "SUPER_ADMIN") {
      toast({
        title: "Ação não permitida",
        description: "Não é possível excluir outro Super Administrador.",
        variant: "destructive",
      });
      return;
    }

    await deleteUserMutation.mutateAsync(user.id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-red-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Gerenciar Usuários</h1>
          </div>
          <p className="text-muted-foreground">
            Controle total de usuários em todas as sedes
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Criar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Usuário</DialogTitle>
              <DialogDescription>
                Criar usuário em qualquer sede do sistema
              </DialogDescription>
            </DialogHeader>
            {/* Form seria implementado aqui */}
            <p className="text-sm text-muted-foreground p-4 text-center">
              Formulário de criação seria implementado aqui
            </p>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nome ou email..."
                  className="pl-10"
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sede</label>
              <Select value={filters.sedeId?.toString() || "all"} onValueChange={handleSedeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as sedes</SelectItem>
                  {sedes.map((sede) => (
                    <SelectItem key={sede.id} value={sede.id.toString()}>
                      {sede.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cargo</label>
              <Select value={filters.cargo || "all"} onValueChange={handleCargoFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os cargos</SelectItem>
                  {Object.entries(cargoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.ativo === undefined ? "all" : filters.ativo.toString()}
                onValueChange={(value) =>
                  setFilters(prev => ({
                    ...prev,
                    ativo: value === "all" ? undefined : value === "true",
                    page: 1
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Ativos</SelectItem>
                  <SelectItem value="false">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários ({usersData?.pagination.total || 0})
          </CardTitle>
          <CardDescription>
            Lista de todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : usersData?.data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum usuário encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="space-y-3">
              {usersData?.data.map((user) => (
                <div key={user.id} className="p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{user.nome}</h3>
                        <Badge
                          variant={user.cargo === "SUPER_ADMIN" ? "destructive" : "secondary"}
                        >
                          {cargoLabels[user.cargo as keyof typeof cargoLabels]}
                        </Badge>
                        <Badge variant={user.status === "ativo" ? "default" : "outline"}>
                          {user.status === "ativo" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{user.email}</p>
                        <p>Sede: {user.sede?.nome}</p>
                        {user.telefone && <p>Tel: {user.telefone}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowTransferDialog(true);
                        }}
                      >
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Transferir
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={user.cargo === "SUPER_ADMIN"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o usuário "{user.nome}"?
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Transferir Usuário */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transferir Usuário</DialogTitle>
            <DialogDescription>
              Transferir {selectedUser?.nome} para outra sede
            </DialogDescription>
          </DialogHeader>
          {/* Form de transferência seria implementado aqui */}
          <p className="text-sm text-muted-foreground p-4 text-center">
            Formulário de transferência seria implementado aqui
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}