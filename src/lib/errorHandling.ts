/**
 * Extrai a mensagem de erro de uma resposta de API ou erro genérico
 * @param error O erro capturado
 * @param fallbackMessage Mensagem padrão caso não seja possível extrair uma mensagem específica
 * @returns A mensagem de erro apropriada
 */
export function extractErrorMessage(
  error: unknown,
  fallbackMessage: string
): string {
  // Verificar se é um erro do Axios com resposta do servidor
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
  }

  // Verificar se é um erro genérico com mensagem
  if (error && typeof error === "object" && "message" in error) {
    const genericError = error as { message: string };
    return genericError.message;
  }

  // Retornar mensagem padrão
  return fallbackMessage;
}

/**
 * Verifica se o erro é relacionado a conflitos de dependências (como sede com voluntários/assistidos)
 * @param error O erro capturado
 * @returns true se for um erro de conflito de dependências
 */
export function isDependencyConflictError(error: unknown): boolean {
  const message = extractErrorMessage(error, "").toLowerCase();
  return (
    message.includes("possui") ||
    message.includes("vinculados") ||
    message.includes("transferi") ||
    message.includes("voluntários") ||
    message.includes("assistidos")
  );
}
