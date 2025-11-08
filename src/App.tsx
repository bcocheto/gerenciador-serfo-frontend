import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Voluntarios from "./pages/Voluntarios";
import Assistidos from "./pages/Assistidos";
import Contribuicoes from "./pages/Contribuicoes";
import Movimentacoes from "./pages/Movimentacoes";
import NotasFiscais from "./pages/NotasFiscais";
import Relatorios from "./pages/Relatorios";
import Sedes from "./pages/Sedes";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContextProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/voluntarios"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "SECRETARIO"]}>
                  <AppLayout>
                    <Voluntarios />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistidos"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "SECRETARIO"]}>
                  <AppLayout>
                    <Assistidos />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contribuicoes"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "TESOUREIRO"]}>
                  <AppLayout>
                    <Contribuicoes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/movimentacoes"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "TESOUREIRO"]}>
                  <AppLayout>
                    <Movimentacoes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notas-fiscais"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "TESOUREIRO"]}>
                  <AppLayout>
                    <NotasFiscais />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute cargos={["PRESIDENTE", "TESOUREIRO"]}>
                  <AppLayout>
                    <Relatorios />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sedes"
              element={
                <ProtectedRoute cargos={["PRESIDENTE"]}>
                  <AppLayout>
                    <Sedes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
