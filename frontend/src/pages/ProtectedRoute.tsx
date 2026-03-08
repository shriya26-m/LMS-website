import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRole?: string;
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Check if user has required role (if specified)
  if (allowedRole && role !== allowedRole) {
    // Redirect to appropriate dashboard based on role
    if (role === "instructor") {
      return <Navigate to="/instructor-dashboard" replace />;
    } else {
      return <Navigate to="/student-dashboard" replace />;
    }
  }

  // User is authenticated and has required role
  return <>{children}</>;
}