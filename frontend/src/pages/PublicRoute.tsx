import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token) {
    // Redirect to appropriate dashboard based on role
    if (role === "instructor") {
      return <Navigate to="/instructorDashboard" replace />;
    } else {
      return <Navigate to="/studentDashboard" replace />;
    }
  }

  return <>{children}</>;
}