import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PaymentConfiguration } from "@shared/schema";

export default function Settings() {
  const currentUser = getCurrentUser();
  const { toast } = useToast();

  const { data: paymentConfigs, isLoading } = useQuery<PaymentConfiguration[]>({
    queryKey: ["/api/admin/payment-configurations"],
  });

  const [paymentMethods, setPaymentMethods] = useState({
    card: false,
    bank_transfer: false,
    ussd: false,
    mobile_money: false,
  });

  useEffect(() => {
    if (paymentConfigs) {
      const methods = {
        card: paymentConfigs.some(c => c.paymentMethod === "card" && c.isEnabled === 1),
        bank_transfer: paymentConfigs.some(c => c.paymentMethod === "bank_transfer" && c.isEnabled === 1),
        ussd: paymentConfigs.some(c => c.paymentMethod === "ussd" && c.isEnabled === 1),
        mobile_money: paymentConfigs.some(c => c.paymentMethod === "mobile_money" && c.isEnabled === 1),
      };
      setPaymentMethods(methods);
    }
  }, [paymentConfigs]);

  const updatePaymentMethod = useMutation({
    mutationFn: async ({ method, enabled }: { method: string; enabled: boolean }) => {
      const config = paymentConfigs?.find(c => c.paymentMethod === method);
      
      if (config) {
        const res = await apiRequest("PUT", `/api/admin/payment-configurations/${config.id}`, {
          isEnabled: enabled ? 1 : 0,
          updatedBy: currentUser?.id,
        });
        return await res.json();
      } else {
        const res = await apiRequest("POST", "/api/admin/payment-configurations", {
          categoryId: null,
          paymentMethod: method,
          isEnabled: enabled ? 1 : 0,
          updatedBy: currentUser?.id,
        });
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-configurations"] });
      toast({
        title: "Payment Method Updated",
        description: "Payment configuration has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Could not update payment configuration. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePaymentToggle = (method: keyof typeof paymentMethods, enabled: boolean) => {
    setPaymentMethods(prev => ({ ...prev, [method]: enabled }));
    updatePaymentMethod.mutate({ method, enabled });
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage system configuration and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Configuration</CardTitle>
            <CardDescription>Manage general system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="lga-name">LGA Name</Label>
              <Input 
                id="lga-name" 
                defaultValue="Abua/Odual Local Government Area" 
                data-testid="input-lga-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email</Label>
              <Input 
                id="contact-email" 
                type="email"
                defaultValue="revenue@abuaodual.gov.ng"
                data-testid="input-contact-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Contact Phone</Label>
              <Input 
                id="contact-phone" 
                type="tel"
                defaultValue="+234 800 IGR ABUA"
                data-testid="input-contact-phone"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Generate Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically generate monthly invoices for recurring payments
                </p>
              </div>
              <Switch data-testid="switch-auto-invoices" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for payments and invoices
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-notifications" />
            </div>

            <Button className="w-full" data-testid="button-save-system">
              Save System Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Gateway</CardTitle>
            <CardDescription>Configure payment processing settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted rounded-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium">Remita Integration</p>
                  <p className="text-sm text-muted-foreground">Mock payment gateway</p>
                </div>
                <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Merchant ID:</span>
                  <span className="font-mono">DEMO-MERCHANT-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Key:</span>
                  <span className="font-mono">••••••••••••</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mode:</span>
                  <span>Demo/Testing</span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Card Payments</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept debit and credit card payments
                    </p>
                  </div>
                  <Switch 
                    checked={paymentMethods.card}
                    onCheckedChange={(checked) => handlePaymentToggle("card", checked)}
                    data-testid="switch-card" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Bank Transfer</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept direct bank transfer payments
                    </p>
                  </div>
                  <Switch 
                    checked={paymentMethods.bank_transfer}
                    onCheckedChange={(checked) => handlePaymentToggle("bank_transfer", checked)}
                    data-testid="switch-bank" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable USSD</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept payments via USSD codes
                    </p>
                  </div>
                  <Switch 
                    checked={paymentMethods.ussd}
                    onCheckedChange={(checked) => handlePaymentToggle("ussd", checked)}
                    data-testid="switch-ussd" 
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Mobile Money</Label>
                    <p className="text-sm text-muted-foreground">
                      Accept mobile money payments
                    </p>
                  </div>
                  <Switch 
                    checked={paymentMethods.mobile_money}
                    onCheckedChange={(checked) => handlePaymentToggle("mobile_money", checked)}
                    data-testid="switch-mobile" 
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Changes are saved automatically when you toggle each payment method.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input defaultValue={currentUser?.fullName} disabled />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={currentUser?.email} disabled />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Input defaultValue={currentUser?.role} disabled className="capitalize" />
            </div>

            <p className="text-sm text-muted-foreground">
              This is a demonstration account. Profile editing is disabled.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About System</CardTitle>
            <CardDescription>System information and version</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">System Name:</span>
                <span className="font-medium">IGR Payment Portal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-mono">1.0.0-demo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Environment:</span>
                <span>Development/Demo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Data Mode:</span>
                <span>Mock Data</span>
              </div>
            </div>

            <Separator />

            <div className="text-sm text-muted-foreground">
              <p className="mb-2">
                This is a demonstration system using mock data to showcase the IGR Payment Portal features.
              </p>
              <p>
                For production deployment, integrate with live payment gateways and database systems.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
