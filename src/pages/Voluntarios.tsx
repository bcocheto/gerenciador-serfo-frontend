import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, UserCheck, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Voluntarios() {
  // Mock data - será substituído pela API real
  const voluntarios = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 98765-4321",
      cpf: "123.456.789-00",
      ativo: true,
      dataAdmissao: "2023-01-15",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 98765-4322",
      cpf: "987.654.321-00",
      ativo: true,
      dataAdmissao: "2023-03-20",
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos@email.com",
      telefone: "(11) 98765-4323",
      cpf: "456.789.123-00",
      ativo: false,
      dataAdmissao: "2022-11-10",
    },
  ];

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

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Voluntários</CardTitle>
              <CardDescription>
                {voluntarios.length} voluntários cadastrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar voluntário..."
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                      <Badge variant={voluntario.ativo ? "default" : "secondary"}>
                        {voluntario.ativo ? "Ativo" : "Inativo"}
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
                      CPF: {voluntario.cpf} • Admissão:{" "}
                      {new Date(voluntario.dataAdmissao).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button variant="ghost" size="sm">
                    Editar
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
