import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  // ✅ If already logged in → go to dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}