import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { AuthContext, User } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Verificar se o token ainda é válido
        const userData = await authService.verifyToken();
        setUser(userData);
      } catch (error) {
        console.error("Token inválido:", error);
        // Limpar dados inválidos
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      }
    }

    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      const response = await authService.login({ email, password });

      // Salvar token e dados do usuário
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${response.user.nome}`,
      });

      navigate("/");
    } catch (error: unknown) {
      console.error("Erro ao fazer login:", error);

      let errorMessage = "Erro ao realizar login";

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number } };
        if (axiosError.response?.status === 401) {
          errorMessage = "E-mail ou senha incorretos";
        } else if (axiosError.response?.status >= 500) {
          errorMessage = "Erro no servidor. Tente novamente mais tarde";
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      toast({
        title: "Erro no login",
        description: errorMessage,
        variant: "destructive",
      });

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Tentar fazer logout na API (mesmo que falhe, vamos limpar localmente)
      await authService.logout().catch(() => {
        // Ignorar erros de logout na API
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Sempre limpar dados locais
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/auth");

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};