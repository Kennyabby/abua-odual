import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, User, Lock, ArrowLeft, CheckCircle2, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_USERS, setCurrentUser, getRoleLabel } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (user) => {
      setCurrentUser(user);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${user.fullName || user.username}!`,
      });

      if (user.role === "citizen") {
        setLocation("/citizen");
      } else {
        setLocation("/dashboard");
      }
    },
    onError: () => {
      toast({
        title: "Invalid Credentials",
        description: "The username or password you entered is incorrect",
        variant: "destructive",
      });
    },
  });

  const handleLogin = () => {
    const user = MOCK_USERS.find(u => u.id === selectedUserId);
    
    if (!user) {
      toast({
        title: "Error",
        description: "Please select a user account",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    setCurrentUser(user);
    if (user.role === "citizen") {
      setLocation("/citizen");
    } else {
      setLocation("/dashboard");
    }
    // loginMutation.mutate({
    //   username: user.username,
    //   password: password,
    // });
  };

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

  return (
    <div className="w-full px-4 py-4 min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding & Info (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div>
          <Button 
            variant="ghost" 
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setLocation("/")}
            data-testid="button-back-home"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-foreground text-primary">
              <Shield className="h-7 w-7" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold">IGR Payment Portal</h1>
              <p className="text-sm text-primary-foreground/80">Abua/Odual LGA</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="font-display text-3xl font-bold leading-tight">
              Secure Revenue Collection Platform
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Pay taxes, levies, and fees conveniently online with our secure payment system.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Multiple Payment Options</p>
                  <p className="text-sm text-primary-foreground/80">Card, Bank Transfer, USSD, Mobile Money</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Instant Receipts</p>
                  <p className="text-sm text-primary-foreground/80">Download payment receipts immediately</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 mt-1 shrink-0" />
                <div>
                  <p className="font-medium">Secure Transactions</p>
                  <p className="text-sm text-primary-foreground/80">Protected by industry-standard encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-primary-foreground/70">
          © 2024 Abua/Odual Local Government Area
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden border-b bg-card p-4">
          <Button 
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back-home-mobile"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8 sm:p-8 lg:p-12">
          <div className="w-full sm:max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Shield className="h-7 w-7" />
                </div>
              </div>
              <h1 className="font-display text-2xl font-bold">IGR Payment Portal</h1>
              <p className="text-muted-foreground text-sm">Abua/Odual Local Government Area</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to access your account</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Mock Authentication</CardTitle>
                <CardDescription>
                  Select a demo account to explore the portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="user-select">Select Demo Account</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger id="user-select" data-testid="select-user">
                      <SelectValue placeholder="Choose a user account..." />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_USERS.map((user) => (
                        <SelectItem key={user.id} value={user.id} data-testid={`option-user-${user.role}`}>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-xs text-muted-foreground">
                                {getRoleLabel(user.role)}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUser && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Account Details</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter password"
                          className="pl-9"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                          data-testid="input-password"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Hint: Use "{selectedUser.password}"
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleLogin}
                  disabled={!selectedUserId || !password || loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Logging in..." : "Login to Portal"}
                </Button>

                <div className="pt-4 border-t">
                  <p className="text-xs text-center text-muted-foreground">
                    This is a demonstration system using mock data
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-normal text-primary" 
                  onClick={() => setLocation("/business/register")}
                >
                  Register your business
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
