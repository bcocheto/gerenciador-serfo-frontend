import { Navigate } from "react-router-dom";
import { CargoVoluntario } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  cargos?: CargoVoluntario[];
}

export function ProtectedRoute({ children, cargos }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (cargos && !cargos.includes(user.cargo)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
