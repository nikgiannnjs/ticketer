import { Navigate, useLocation } from "react-router";
import { useAuth } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { accessToken, isSuperAdmin } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
}
