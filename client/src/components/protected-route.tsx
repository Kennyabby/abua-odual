import { useEffect } from "react";
import { useLocation } from "wouter";
import { getCurrentUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!currentUser) {
      setLocation("/");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      if (currentUser.role === "citizen") {
        setLocation("/citizen");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [currentUser, allowedRoles, setLocation]);

  if (!currentUser) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  return <>{children}</>;
}
