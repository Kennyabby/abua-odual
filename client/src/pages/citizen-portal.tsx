import { useState } from "react";
import { useLocation } from "wouter";
import { getCurrentUser, logout, getRoleLabel } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, Receipt, FileText, Search, LogOut, CreditCard, History } from "lucide-react";

export default function CitizenPortal() {
  const [, setLocation] = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) {
    setLocation("/");
    return null;
  }

  const userInitials = currentUser.fullName 
    ? currentUser.fullName.split(' ').map(n => n[0]).join('').toUpperCase()
    : currentUser.username.substring(0, 2).toUpperCase();

  const firstName = currentUser.fullName 
    ? currentUser.fullName.split(' ')[0] 
    : currentUser.username;

  const menuItems = [
    {
      title: "Make Payment",
      description: "Pay your taxes, fees, and levies online",
      icon: CreditCard,
      path: "/citizen/payment",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "My Invoices",
      description: "View and pay your pending invoices",
      icon: FileText,
      path: "/citizen/invoices",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "Payment History",
      description: "Track all your payment transactions",
      icon: History,
      path: "/citizen/history",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      title: "Verify Receipt",
      description: "Verify payment receipts and RRR numbers",
      icon: Search,
      path: "/verify",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
  ];

  return (
    <div className="w-full px-4 py-4 min-h-screen bg-background">
      <header className="border-b bg-card">
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold mb-2">Welcome, {firstName}!</h2>
            <p className="text-muted-foreground">
              Manage your payments and view your transaction history
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {menuItems.map((item) => (
              <Card
                key={item.title}
                className="hover-elevate active-elevate-2 cursor-pointer transition-all"
                onClick={() => setLocation(item.path)}
                data-testid={`card-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-md ${item.bgColor}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {item.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For assistance with payments or inquiries about revenue collection, please contact:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> revenue@abuaodual.gov.ng</p>
                <p><strong>Phone:</strong> +234 800 IGR ABUA (800 447 2282)</p>
                <p><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
