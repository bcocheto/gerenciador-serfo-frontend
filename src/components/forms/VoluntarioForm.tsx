import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { masks, validators, parsers } from "@/lib/masks";
import { Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { voluntarioService, Voluntario } from "@/services/voluntarioService";
import { sedeService } from "@/services/sedeService";

const voluntarioSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  email: z.string()
    .min(1, "Email é obrigatório")
    .email("Email inválido"),
  telefone: z.string()
    .min(1, "Telefone é obrigatório")
    .refine((val) => validators.phone(val), "Telefone inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  dataIngresso: z.string().min(1, "Data de ingresso é obrigatória"),
  observacoes: z.string().optional(),
  sedeId: z.number({
    required_error: "Sede é obrigatória",
    invalid_type_error: "Selecione uma sede válida",
  }),
  cargo: z.enum(["PRESIDENTE", "SECRETARIO", "TESOUREIRO", "VOLUNTARIO"], {
    required_error: "Cargo é obrigatório",
  }),
});

type VoluntarioFormData = z.infer<typeof voluntarioSchema>;

interface VoluntarioFormProps {
  onSuccess?: () => void;
  voluntario?: Voluntario;
  isEdit?: boolean;
}

export function VoluntarioForm({ onSuccess, voluntario, isEdit = false }: VoluntarioFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar sedes ativas para o select
  const { data: sedes = [], isLoading: sedesLoading } = useQuery({
    queryKey: ["sedes", "ativas"],
    queryFn: () => sedeService.listAtivas(),
  });

  const form = useForm<VoluntarioFormData>({
    resolver: zodResolver(voluntarioSchema),
    defaultValues: {
      nome: voluntario?.nome || "",
      email: voluntario?.email || "",
      telefone: voluntario?.telefone || "",
      endereco: voluntario?.endereco || "",
      dataNascimento: voluntario?.dataNascimento || "",
      dataIngresso: voluntario?.dataIngresso || "",
      observacoes: voluntario?.observacoes || "",
      sedeId: voluntario?.sedeId || undefined,
      cargo: voluntario?.cargo || "VOLUNTARIO",
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: voluntarioService.createVoluntario,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: "Voluntário cadastrado",
        description: "Voluntário cadastrado com sucesso!",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar voluntário.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: VoluntarioFormData }) =>
      voluntarioService.updateVoluntario(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: "Voluntário atualizado",
        description: "Voluntário atualizado com sucesso!",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar voluntário.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: VoluntarioFormData) => {
    const formattedData = {
      nome: data.nome,
      email: data.email,
      telefone: parsers.phone(data.telefone),
      endereco: data.endereco,
      dataNascimento: data.dataNascimento,
      dataIngresso: data.dataIngresso,
      observacoes: data.observacoes,
      sedeId: data.sedeId,
      cargo: data.cargo,
    };

    if (isEdit && voluntario?.id) {
      updateMutation.mutate({ id: voluntario.id, data: formattedData });
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo *</FormLabel>
              <FormControl>
                <Input placeholder="João Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="joao@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 98765-4321"
                    {...field}
                    onChange={(e) => {
                      const maskedValue = masks.phone(e.target.value);
                      field.onChange(maskedValue);
                    }}
                    maxLength={15}
                  />
                </FormControl>
                <FormDescription>
                  Celular ou telefone fixo
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataIngresso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Ingresso *</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="endereco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Rua Exemplo, 123 - Bairro" {...field} />
              </FormControl>
              <FormDescription>
                Endereço completo (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sedeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sede *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString() || ""}
                  disabled={sedesLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma sede" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sedes.map((sede) => (
                      <SelectItem key={sede.id} value={sede.id.toString()}>
                        {sede.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Sede onde o voluntário atua
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VOLUNTARIO">Voluntário</SelectItem>
                    <SelectItem value="SECRETARIO">Secretário</SelectItem>
                    <SelectItem value="TESOUREIRO">Tesoureiro</SelectItem>
                    <SelectItem value="PRESIDENTE">Presidente</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Função do voluntário na organização
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre o voluntário..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Informações complementares (opcional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />



        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isLoading
              ? "Salvando..."
              : isEdit
                ? "Atualizar Voluntário"
                : "Cadastrar Voluntário"}
          </Button>

          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isLoading}
            >
              Limpar Formulário
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
