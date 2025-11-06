import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Receipt, Download, Mail, XCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

type StatusNota = "Emitida" | "Cancelada" | "Pendente";

export default function NotasFiscais() {
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [notasSelecionadas, setNotasSelecionadas] = useState<number[]>([]);
  const { toast } = useToast();

  // Mock data - será substituído pela API real
  const notas = [
    {
      id: 1,
      numero: "NF-2024-001",
      pessoa: "João Silva",
      tipo: "Voluntário",
      valor: 150.00,
      dataEmissao: "2024-12-03",
      status: "Emitida" as StatusNota,
      contribuicaoId: 1,
    },
    {
      id: 2,
      numero: "NF-2024-002",
      pessoa: "Ana Paula Costa",
      tipo: "Assistido",
      valor: 100.00,
      dataEmissao: "2024-12-07",
      status: "Emitida" as StatusNota,
      contribuicaoId: 4,
    },
    {
      id: 3,
      numero: "NF-2024-003",
      pessoa: "Carlos Oliveira",
      tipo: "Voluntário",
      valor: 180.00,
      dataEmissao: "2024-11-20",
      status: "Cancelada" as StatusNota,
      contribuicaoId: 3,
      motivoCancelamento: "Erro no valor",
    },
    {
      id: 4,
      numero: "NF-2024-004",
      pessoa: "Maria Santos",
      tipo: "Voluntário",
      valor: 200.00,
      dataEmissao: "2024-12-10",
      status: "Emitida" as StatusNota,
      contribuicaoId: 2,
    },
  ];

  const notasFiltradas = notas.filter((n) => {
    if (filtroStatus === "todos") return true;
    return n.status === filtroStatus;
  });

  const totalEmitidas = notas.filter((n) => n.status === "Emitida").length;
  const totalCanceladas = notas.filter((n) => n.status === "Cancelada").length;
  const valorTotal = notas
    .filter((n) => n.status === "Emitida")
    .reduce((acc, n) => acc + n.valor, 0);

  const handleSelectNota = (notaId: number) => {
    setNotasSelecionadas((prev) =>
      prev.includes(notaId)
        ? prev.filter((id) => id !== notaId)
        : [...prev, notaId]
    );
  };

  const handleGerarEmLote = () => {
    toast({
      title: "Gerando notas em lote",
      description: `${notasSelecionadas.length} notas serão geradas`,
    });
    setNotasSelecionadas([]);
  };

  const handleReenviarEmail = (numero: string) => {
    toast({
      title: "Email reenviado",
      description: `Nota ${numero} enviada com sucesso`,
    });
  };

  const handleCancelarNota = (numero: string) => {
    toast({
      title: "Nota cancelada",
      description: `Nota ${numero} foi cancelada`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notas Fiscais</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie a emissão e controle de notas fiscais
          </p>
        </div>
        <div className="flex gap-2">
          {notasSelecionadas.length > 0 && (
            <Button variant="outline" onClick={handleGerarEmLote}>
              <FileText className="h-4 w-4 mr-2" />
              Gerar {notasSelecionadas.length} em Lote
            </Button>
          )}
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Nota Fiscal
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Emitidas</CardTitle>
            <Receipt className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEmitidas}</div>
            <p className="text-xs text-muted-foreground mt-1">No período atual</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notas Canceladas</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCanceladas}</div>
            <p className="text-xs text-muted-foreground mt-1">No período atual</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <Receipt className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Notas emitidas</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Notas Fiscais</CardTitle>
              <CardDescription>
                {notasFiltradas.length} notas registradas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Emitida">Emitidas</SelectItem>
                  <SelectItem value="Cancelada">Canceladas</SelectItem>
                  <SelectItem value="Pendente">Pendentes</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nota..."
                  className="pl-10 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notasFiltradas.map((nota) => (
              <div
                key={nota.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={notasSelecionadas.includes(nota.id)}
                    onCheckedChange={() => handleSelectNota(nota.id)}
                    disabled={nota.status === "Cancelada"}
                  />
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Receipt className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {nota.numero}
                      </h3>
                      <Badge
                        variant={
                          nota.status === "Emitida"
                            ? "default"
                            : nota.status === "Cancelada"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {nota.status}
                      </Badge>
                      <Badge variant="outline">{nota.tipo}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{nota.pessoa}</span>
                      <span>•</span>
                      <span>
                        Emissão: {new Date(nota.dataEmissao).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    {nota.motivoCancelamento && (
                      <p className="text-xs text-destructive mt-1">
                        Motivo: {nota.motivoCancelamento}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      R$ {nota.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {nota.status === "Emitida" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReenviarEmail(nota.numero)}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCancelarNota(nota.numero)}
                        >
                          <XCircle className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    {nota.status === "Cancelada" && (
                      <Button variant="outline" size="sm" disabled>
                        Cancelada
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
