import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Assistidos() {
  // Mock data - será substituído pela API real
  const assistidos = [
    {
      id: 1,
      nome: "Ana Paula Costa",
      email: "ana@email.com",
      telefone: "(11) 91234-5678",
      cpf: "111.222.333-44",
      ativo: true,
      dataCadastro: "2023-02-10",
    },
    {
      id: 2,
      nome: "Roberto Lima",
      email: "roberto@email.com",
      telefone: "(11) 91234-5679",
      cpf: "222.333.444-55",
      ativo: true,
      dataCadastro: "2023-04-15",
    },
    {
      id: 3,
      nome: "Fernanda Rocha",
      email: "fernanda@email.com",
      telefone: "(11) 91234-5680",
      cpf: "333.444.555-66",
      ativo: true,
      dataCadastro: "2023-01-05",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assistidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os assistidos pela organização
          </p>
        </div>
        <Button>
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
                {assistidos.length} assistidos cadastrados
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar assistido..."
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                      <Badge variant={assistido.ativo ? "default" : "secondary"}>
                        {assistido.ativo ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {assistido.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {assistido.telefone}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      CPF: {assistido.cpf} • Cadastro:{" "}
                      {new Date(assistido.dataCadastro).toLocaleDateString("pt-BR")}
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
