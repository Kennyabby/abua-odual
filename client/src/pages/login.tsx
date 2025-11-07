import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, User, Lock } from "lucide-react";
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

    loginMutation.mutate({
      username: user.username,
      password: password,
    });
  };

  const selectedUser = MOCK_USERS.find(u => u.id === selectedUserId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">IGR Payment Portal</h1>
          <p className="text-muted-foreground">Abua/Odual Local Government Area</p>
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
              <div className="space-y-4 p-4 bg-muted rounded-md">
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
      </div>
    </div>
  );
}
