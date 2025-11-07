import { getCurrentUser, logout, getRoleLabel } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Home } from "lucide-react";
import { useLocation } from "wouter";

export function CitizenLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const userInitials = currentUser.fullName 
    ? currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : currentUser.username.substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-xl font-bold">IGR Payment Portal</h1>
                <p className="text-xs text-muted-foreground">Abua/Odual LGA</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/citizen")}
                data-testid="button-home"
              >
                <Home className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <div className="hidden sm:flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium">{currentUser.fullName || currentUser.username}</p>
                  <Badge variant="secondary" className="text-xs">
                    {getRoleLabel(currentUser.role)}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={logout} data-testid="button-logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
