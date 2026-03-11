// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  // Se sei loggato → fai entrare
  // Se non sei loggato → mandalo al login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}