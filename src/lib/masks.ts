// Utilitários para aplicar máscaras em inputs de formulário

export const masks = {
  /**
   * Aplica máscara de CPF: 000.000.000-00
   */
  cpf: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }

    return value;
  },

  /**
   * Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
   */
  phone: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 11) {
      if (cleanValue.length <= 10) {
        // Telefone fixo: (00) 0000-0000
        return cleanValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2")
          .replace(/(-\d{4})\d+?$/, "$1");
      } else {
        // Celular: (00) 00000-0000
        return cleanValue
          .replace(/(\d{2})(\d)/, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2")
          .replace(/(-\d{4})\d+?$/, "$1");
      }
    }

    return value;
  },

  /**
   * Aplica máscara de valor monetário: R$ 0.000,00
   */
  currency: (value: string): string => {
    // Remove tudo que não é dígito
    const cleanValue = value.replace(/\D/g, "");

    // Se estiver vazio, retorna vazio
    if (!cleanValue) return "";

    // Converte para centavos
    const cents = parseInt(cleanValue, 10);

    // Converte para formato decimal
    const formatted = (cents / 100).toFixed(2);

    // Aplica separadores brasileiros
    return formatted.replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  },

  /**
   * Aplica máscara de CEP: 00000-000
   */
  cep: (value: string): string => {
    const cleanValue = value.replace(/\D/g, "");

    if (cleanValue.length <= 8) {
      return cleanValue.replace(/(\d{5})(\d)/, "$1-$2");
    }

    return value;
  },
};

export const validators = {
  /**
   * Valida CPF brasileiro
   */
  cpf: (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, "");

    if (cleanCpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    // Valida primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cleanCpf.charAt(9))) return false;

    // Valida segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit === 10 || digit === 11) digit = 0;
    if (digit !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  },

  /**
   * Valida telefone brasileiro
   */
  phone: (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  },

  /**
   * Valida CEP brasileiro
   */
  cep: (cep: string): boolean => {
    const cleanCep = cep.replace(/\D/g, "");
    return cleanCep.length === 8;
  },
};

export const parsers = {
  /**
   * Remove máscara do CPF e retorna apenas números
   */
  cpf: (maskedCpf: string): string => {
    return maskedCpf.replace(/\D/g, "");
  },

  /**
   * Remove máscara do telefone e retorna apenas números
   */
  phone: (maskedPhone: string): string => {
    return maskedPhone.replace(/\D/g, "");
  },

  /**
   * Converte valor monetário mascarado para número
   */
  currency: (maskedCurrency: string): number => {
    const cleanValue = maskedCurrency
      .replace(/\./g, "") // Remove pontos dos milhares
      .replace(",", "."); // Substitui vírgula decimal por ponto

    return parseFloat(cleanValue) || 0;
  },

  /**
   * Remove máscara do CEP e retorna apenas números
   */
  cep: (maskedCep: string): string => {
    return maskedCep.replace(/\D/g, "");
  },
};
