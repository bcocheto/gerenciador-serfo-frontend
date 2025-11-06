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
import { useToast } from "@/hooks/use-toast";
import { masks, validators, parsers } from "@/lib/masks";
import { Loader2 } from "lucide-react";

const assistidoSchema = z.object({
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
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .refine((val) => validators.cpf(val), "CPF inválido"),
  endereco: z.string().optional(),
  observacoes: z.string().optional(),
  ativo: z.boolean().default(true),
});

type AssistidoFormData = z.infer<typeof assistidoSchema>;

interface AssistidoFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<AssistidoFormData>;
  isEdit?: boolean;
}

export function AssistidoForm({ onSuccess, defaultValues, isEdit = false }: AssistidoFormProps) {
  const { toast } = useToast();

  const form = useForm<AssistidoFormData>({
    resolver: zodResolver(assistidoSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      endereco: "",
      observacoes: "",
      ativo: true,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: AssistidoFormData) => {
    try {
      // Limpa máscaras antes de enviar
      const formattedData = {
        ...data,
        telefone: parsers.phone(data.telefone),
        cpf: parsers.cpf(data.cpf),
      };

      // TODO: Integrar com API real
      console.log("Dados do assistido:", formattedData);

      toast({
        title: isEdit ? "Assistido atualizado" : "Assistido cadastrado",
        description: `${data.nome} foi ${isEdit ? "atualizado" : "cadastrado"} com sucesso!`,
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar assistido:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o assistido",
        variant: "destructive",
      });
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ana@email.com" {...field} />
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
                    placeholder="(11) 91234-5678"
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

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF *</FormLabel>
              <FormControl>
                <Input
                  placeholder="111.222.333-44"
                  {...field}
                  onChange={(e) => {
                    const maskedValue = masks.cpf(e.target.value);
                    field.onChange(maskedValue);
                  }}
                  maxLength={14}
                />
              </FormControl>
              <FormDescription>
                Documento de identificação
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="ativo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Assistido Ativo</FormLabel>
                <FormDescription>
                  Define se o assistido está ativo no sistema
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex items-center gap-2"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {form.formState.isSubmitting
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
              disabled={form.formState.isSubmitting}
            >
              Limpar Formulário
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
