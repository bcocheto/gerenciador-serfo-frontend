import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const contribuicaoSchema = z.object({
  pessoaId: z.string().min(1, "Selecione uma pessoa"),
  tipo: z.enum(["Voluntário", "Assistido"]),
  valor: z.string().min(1, "Valor é obrigatório").transform((val) => parseFloat(val.replace(",", "."))),
  vencimento: z.date({
    required_error: "Data de vencimento é obrigatória",
  }),
  descricao: z.string().optional(),
});

type ContribuicaoFormData = z.infer<typeof contribuicaoSchema>;

interface ContribuicaoFormProps {
  onSuccess?: () => void;
}

export function ContribuicaoForm({ onSuccess }: ContribuicaoFormProps) {
  const { toast } = useToast();
  
  const form = useForm<ContribuicaoFormData>({
    resolver: zodResolver(contribuicaoSchema),
    defaultValues: {
      pessoaId: "",
      tipo: "Voluntário",
      valor: "" as any,
      descricao: "",
    },
  });

  const onSubmit = async (data: ContribuicaoFormData) => {
    try {
      // TODO: Integrar com API real
      console.log("Dados da contribuição:", data);
      
      toast({
        title: "Contribuição cadastrada",
        description: `Contribuição de R$ ${data.valor.toFixed(2)} cadastrada com sucesso!`,
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar a contribuição",
        variant: "destructive",
      });
    }
  };

  // Mock data - substituir por dados reais da API
  const pessoas = [
    { id: "1", nome: "João Silva" },
    { id: "2", nome: "Maria Santos" },
    { id: "3", nome: "Carlos Oliveira" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Pessoa *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Voluntário">Voluntário</SelectItem>
                  <SelectItem value="Assistido">Assistido</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pessoaId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pessoa *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a pessoa" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {pessoas.map((pessoa) => (
                    <SelectItem key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor *</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="150.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Formato: 150.00 ou 150,00
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vencimento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Observações sobre a contribuição..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Cadastrando..." : "Cadastrar Contribuição"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
