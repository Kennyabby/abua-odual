import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { CitizenLayout } from "@/components/citizen-layout";
import { getCurrentUser } from "@/lib/auth";

import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import CitizenPortal from "@/pages/citizen-portal";
import Dashboard from "@/pages/dashboard";
import RevenueSources from "@/pages/revenue-sources";
import Invoices from "@/pages/invoices";
import Payments from "@/pages/payments";
import Taxpayers from "@/pages/taxpayers";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import PaymentFlow from "@/pages/payment-flow";
import Verify from "@/pages/verify";

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center gap-2 p-4 border-b bg-card">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
        </header>
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  const currentUser = getCurrentUser();

  const publicRoutes = ["/", "/verify"];
  const isPublicRoute = publicRoutes.includes(location);

  if (!currentUser && !isPublicRoute) {
    return <Login />;
  }

  const isAdminRoute = location.startsWith("/dashboard") || 
                       location.startsWith("/revenue-sources") || 
                       location.startsWith("/invoices") || 
                       location.startsWith("/payments") || 
                       location.startsWith("/taxpayers") || 
                       location.startsWith("/reports") || 
                       location.startsWith("/settings");

  const adminRoutes = (
    <ProtectedRoute allowedRoles={["admin", "finance_officer", "auditor"]}>
      <AdminLayout>
        <Switch>
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/revenue-sources">
            <ProtectedRoute allowedRoles={["admin", "finance_officer"]}>
              <RevenueSources />
            </ProtectedRoute>
          </Route>
          <Route path="/invoices">
            <ProtectedRoute allowedRoles={["admin", "finance_officer"]}>
              <Invoices />
            </ProtectedRoute>
          </Route>
          <Route path="/payments" component={Payments} />
          <Route path="/taxpayers">
            <ProtectedRoute allowedRoles={["admin", "finance_officer"]}>
              <Taxpayers />
            </ProtectedRoute>
          </Route>
          <Route path="/reports" component={Reports} />
          <Route path="/settings">
            <ProtectedRoute allowedRoles={["admin"]}>
              <Settings />
            </ProtectedRoute>
          </Route>
        </Switch>
      </AdminLayout>
    </ProtectedRoute>
  );

  if (isAdminRoute && currentUser && ["admin", "finance_officer", "auditor"].includes(currentUser.role)) {
    return adminRoutes;
  }

  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/verify" component={Verify} />
      <Route path="/citizen">
        <ProtectedRoute allowedRoles={["citizen"]}>
          <CitizenPortal />
        </ProtectedRoute>
      </Route>
      <Route path="/citizen/payment">
        <ProtectedRoute allowedRoles={["citizen"]}>
          <CitizenLayout>
            <PaymentFlow />
          </CitizenLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/citizen/invoices">
        <ProtectedRoute allowedRoles={["citizen"]}>
          <CitizenLayout>
            <Invoices />
          </CitizenLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/citizen/history">
        <ProtectedRoute allowedRoles={["citizen"]}>
          <CitizenLayout>
            <Payments />
          </CitizenLayout>
        </ProtectedRoute>
      </Route>
      {adminRoutes}
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider style={style as React.CSSProperties}>
          <Router />
        </SidebarProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
