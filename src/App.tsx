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
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

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
                <ProtectedRoute roles={["admin", "secretario"]}>
                  <AppLayout>
                    <Voluntarios />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/assistidos"
              element={
                <ProtectedRoute roles={["admin", "secretario"]}>
                  <AppLayout>
                    <Assistidos />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/contribuicoes"
              element={
                <ProtectedRoute roles={["admin", "tesoureiro"]}>
                  <AppLayout>
                    <Contribuicoes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/movimentacoes"
              element={
                <ProtectedRoute roles={["admin", "tesoureiro"]}>
                  <AppLayout>
                    <Movimentacoes />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/notas-fiscais"
              element={
                <ProtectedRoute roles={["admin", "tesoureiro"]}>
                  <AppLayout>
                    <NotasFiscais />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <ProtectedRoute roles={["admin", "tesoureiro"]}>
                  <AppLayout>
                    <Relatorios />
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
