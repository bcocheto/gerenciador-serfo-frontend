import { createContext } from "react";

export type UserRole = "admin" | "secretario" | "tesoureiro" | "voluntario";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);