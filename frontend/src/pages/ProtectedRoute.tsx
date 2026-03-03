import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" />;
  }else{
    return <>{children}</>;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}