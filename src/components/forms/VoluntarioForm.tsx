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
import { useToast } from "@/hooks/use-toast";

const voluntarioSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido (formato: 000.000.000-00)"),
  endereco: z.string().optional(),
  ativo: z.boolean().default(true),
});

type VoluntarioFormData = z.infer<typeof voluntarioSchema>;

interface VoluntarioFormProps {
  onSuccess?: () => void;
  defaultValues?: Partial<VoluntarioFormData>;
  isEdit?: boolean;
}

export function VoluntarioForm({ onSuccess, defaultValues, isEdit = false }: VoluntarioFormProps) {
  const { toast } = useToast();
  
  const form = useForm<VoluntarioFormData>({
    resolver: zodResolver(voluntarioSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      cpf: "",
      endereco: "",
      ativo: true,
      ...defaultValues,
    },
  });

  const onSubmit = async (data: VoluntarioFormData) => {
    try {
      // TODO: Integrar com API real
      console.log("Dados do voluntário:", data);
      
      toast({
        title: isEdit ? "Voluntário atualizado" : "Voluntário cadastrado",
        description: `${data.nome} foi ${isEdit ? "atualizado" : "cadastrado"} com sucesso!`,
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o voluntário",
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
                  <Input placeholder="(11) 98765-4321" {...field} />
                </FormControl>
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
                <Input placeholder="123.456.789-00" {...field} />
              </FormControl>
              <FormDescription>
                Formato: 000.000.000-00
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
                <Input placeholder="Rua Exemplo, 123" {...field} />
              </FormControl>
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
                <FormLabel className="text-base">Voluntário Ativo</FormLabel>
                <FormDescription>
                  Define se o voluntário está ativo no sistema
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting
              ? "Salvando..."
              : isEdit
              ? "Atualizar Voluntário"
              : "Cadastrar Voluntário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
