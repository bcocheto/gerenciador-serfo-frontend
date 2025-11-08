import { createContext } from "react";

export type CargoVoluntario = "PRESIDENTE" | "PRESIDENTE_ADJUNTO" | "SECRETARIO" | "TESOUREIRO" | "MEMBRO";

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  sedeId: number;
  cargo: CargoVoluntario;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);