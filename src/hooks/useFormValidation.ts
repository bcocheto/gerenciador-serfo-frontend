import { z } from "zod";
import { validators } from "@/lib/masks";

// Schemas reutilizáveis (não é um hook, então pode ser usado em qualquer lugar)
export const validationSchemas = {
  // Validação de nome
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

  // Validação de email
  email: z.string().min(1, "Email é obrigatório").email("Email inválido"),

  // Validação de email opcional
  emailOpcional: z
    .string()
    .optional()
    .refine(
      (val) => !val || z.string().email().safeParse(val).success,
      "Email inválido"
    ),

  // Validação de telefone
  telefone: z
    .string()
    .min(1, "Telefone é obrigatório")
    .refine((val) => validators.phone(val), "Telefone inválido"),

  // Validação de CPF
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => validators.cpf(val), "CPF inválido"),

  // Validação de senha
  senha: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),

  // Validação de senha forte
  senhaForte: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial"
    ),

  // Validação de data obrigatória
  dataObrigatoria: z.date({
    required_error: "Data é obrigatória",
    invalid_type_error: "Data inválida",
  }),

  // Validação de data opcional
  dataOpcional: z.date().optional(),

  // Validação de valor monetário
  valorMonetario: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => {
      const numericValue = parseFloat(
        val.replace(",", ".").replace(/[^\d.,]/g, "")
      );
      return !isNaN(numericValue) && numericValue > 0;
    }, "Valor deve ser maior que zero"),

  // Validação de texto longo opcional
  textoLongo: z
    .string()
    .max(1000, "Texto deve ter no máximo 1000 caracteres")
    .optional(),
};

/**
 * Hook para validações customizadas de formulários
 * Centraliza validações comuns e reutilizáveis
 */
export const useFormValidation = () => {
  // Função para criar schema de confirmação de senha
  const createSenhaConfirmationSchema = (senhaField: string) => {
    return z
      .object({
        [senhaField]: validationSchemas.senha,
        confirmacaoSenha: z.string(),
      })
      .refine((data) => data[senhaField] === data.confirmacaoSenha, {
        message: "As senhas não coincidem",
        path: ["confirmacaoSenha"],
      });
  };

  // Validações condicionais
  const conditionalValidations = {
    // Email obrigatório apenas se o usuário for voluntário
    emailCondicional: (tipo: string) =>
      tipo === "voluntario"
        ? validationSchemas.email
        : validationSchemas.emailOpcional,

    // Telefone obrigatório apenas se não tiver email
    telefoneCondicional: (email?: string) =>
      !email || email.trim() === ""
        ? validationSchemas.telefone
        : z.string().optional(),
  };

  // Mensagens de erro customizadas
  const errorMessages = {
    required: "Este campo é obrigatório",
    invalid: "Valor inválido",
    tooShort: (min: number) => `Deve ter pelo menos ${min} caracteres`,
    tooLong: (max: number) => `Deve ter no máximo ${max} caracteres`,
    invalidFormat: "Formato inválido",
    passwordMismatch: "As senhas não coincidem",
    invalidDate: "Data inválida",
    futureDate: "A data deve ser futura",
    pastDate: "A data deve ser no passado",
  };

  // Validadores específicos para regras de negócio
  const businessValidators = {
    // Valida se a data de vencimento é futura
    dataVencimentoFutura: (date: Date) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return date >= hoje;
    },

    // Valida se a data de nascimento é válida (pessoa deve ter pelo menos 14 anos)
    dataNascimentoValida: (date: Date) => {
      const hoje = new Date();
      const idade = hoje.getFullYear() - date.getFullYear();
      return idade >= 14;
    },

    // Valida se o valor está dentro de um range
    valorNoRange: (value: number, min: number, max: number) => {
      return value >= min && value <= max;
    },
  };

  return {
    schemas: validationSchemas,
    createSenhaConfirmationSchema,
    conditionalValidations,
    errorMessages,
    businessValidators,
  };
};

// Schema base para pessoa (usado em voluntários e assistidos)
export const createPessoaSchema = () => {
  return z.object({
    nome: validationSchemas.nome,
    email: validationSchemas.email,
    telefone: validationSchemas.telefone,
    cpf: validationSchemas.cpf,
    endereco: z.string().optional(),
    observacoes: validationSchemas.textoLongo,
    ativo: z.boolean().default(true),
  });
};

// Schema para contribuições
export const createContribuicaoSchema = () => {
  return z.object({
    pessoaId: z.string().min(1, "Selecione uma pessoa"),
    tipo: z.enum(["Voluntário", "Assistido"], {
      required_error: "Selecione o tipo de pessoa",
    }),
    valor: validationSchemas.valorMonetario,
    vencimento: validationSchemas.dataObrigatoria.refine((date) => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      return date >= hoje;
    }, "Data de vencimento deve ser futura"),
    descricao: validationSchemas.textoLongo,
  });
};

// Schema para login
export const createLoginSchema = () => {
  return z.object({
    email: validationSchemas.email,
    password: validationSchemas.senha,
  });
};
