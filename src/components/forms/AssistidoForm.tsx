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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { masks, validators, parsers } from "@/lib/masks";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assistidoService, Assistido } from "@/services/assistidoService";

const assistidoSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .refine((val) => validators.cpf(val), "CPF inválido"),
  rg: z.string().min(1, "RG é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  responsavelNome: z.string().optional(),
  responsavelTelefone: z.string().optional(),
  responsavelParentesco: z.string().optional(),
  situacaoSocial: z.string().min(1, "Situação social é obrigatória"),
  observacoes: z.string().optional(),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
});

type AssistidoFormData = z.infer<typeof assistidoSchema>;

interface AssistidoFormProps {
  onSuccess?: () => void;
  assistido?: Assistido;
  isEdit?: boolean;
}

export function AssistidoForm({ onSuccess, assistido, isEdit = false }: AssistidoFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AssistidoFormData>({
    resolver: zodResolver(assistidoSchema),
    defaultValues: {
      nome: assistido?.nome || "",
      cpf: assistido?.cpf || "",
      rg: assistido?.rg || "",
      dataNascimento: assistido?.dataNascimento || "",
      endereco: assistido?.endereco || "",
      telefone: assistido?.telefone || "",
      email: assistido?.email || "",
      responsavelNome: assistido?.responsavelNome || "",
      responsavelTelefone: assistido?.responsavelTelefone || "",
      responsavelParentesco: assistido?.responsavelParentesco || "",
      situacaoSocial: assistido?.situacaoSocial || "",
      observacoes: assistido?.observacoes || "",
      dataInicio: assistido?.dataInicio || "",
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: assistidoService.createAssistido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistidos'] });
      toast({
        title: "Assistido cadastrado",
        description: "Assistido cadastrado com sucesso!",
      });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar assistido.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssistidoFormData }) =>
      assistidoService.updateAssistido(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistidos'] });
      toast({
        title: "Assistido atualizado",
        description: "Assistido atualizado com sucesso!",
      });
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar assistido.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: AssistidoFormData) => {
    const formattedData = {
      nome: data.nome,
      cpf: parsers.cpf(data.cpf),
      rg: data.rg,
      dataNascimento: data.dataNascimento,
      endereco: data.endereco,
      telefone: data.telefone ? parsers.phone(data.telefone) : undefined,
      email: data.email || undefined,
      responsavelNome: data.responsavelNome || undefined,
      responsavelTelefone: data.responsavelTelefone ? parsers.phone(data.responsavelTelefone) : undefined,
      responsavelParentesco: data.responsavelParentesco || undefined,
      situacaoSocial: data.situacaoSocial,
      observacoes: data.observacoes || undefined,
      dataInicio: data.dataInicio,
    };

    if (isEdit && assistido?.id) {
      updateMutation.mutate({ id: assistido.id, data: formattedData });
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
                <Input placeholder="Ana Paula Costa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="123.456.789-00"
                    {...field}
                    onChange={(e) => {
                      const maskedValue = masks.cpf(e.target.value);
                      field.onChange(maskedValue);
                    }}
                    maxLength={14}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RG *</FormLabel>
                <FormControl>
                  <Input placeholder="12.345.678-9" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataNascimento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Nascimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
              <FormLabel>Endereço Completo *</FormLabel>
              <FormControl>
                <Input placeholder="Rua Exemplo, 123 - Bairro - Cidade/UF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
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
                  Telefone de contato (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="assistido@email.com" {...field} />
                </FormControl>
                <FormDescription>
                  Email de contato (opcional)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações do Responsável (se menor de idade)</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="responsavelNome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavelTelefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do Responsável</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="responsavelParentesco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parentesco</FormLabel>
                  <FormControl>
                    <Input placeholder="Mãe, Pai, Avó, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="situacaoSocial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação Social *</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Baixa renda, Vulnerabilidade social" {...field} />
                </FormControl>
                <FormDescription>
                  Breve descrição da situação social
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dataInicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início do Atendimento *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
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
                  placeholder="Informações adicionais sobre o assistido..."
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
                ? "Atualizar Assistido"
                : "Cadastrar Assistido"}
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
