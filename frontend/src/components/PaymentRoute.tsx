import { Navigate } from "react-router";

export const PaymentRoute = ({ children }: { children: React.ReactNode }) => {
  const hasActivePayment = localStorage.getItem("stripe_session_id");

  if (!hasActivePayment) {
    return <Navigate to="/events" replace />;
  }

  return <>{children}</>;
};
