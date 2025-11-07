import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/auth";

export default function Settings() {
  const currentUser = getCurrentUser();

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

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Card Payments</Label>
                <p className="text-sm text-muted-foreground">
                  Accept debit and credit card payments
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-card" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Bank Transfer</Label>
                <p className="text-sm text-muted-foreground">
                  Accept direct bank transfer payments
                </p>
              </div>
              <Switch defaultChecked data-testid="switch-bank" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable USSD</Label>
                <p className="text-sm text-muted-foreground">
                  Accept payments via USSD codes
                </p>
              </div>
              <Switch data-testid="switch-ussd" />
            </div>

            <Button className="w-full" data-testid="button-save-payment">
              Save Payment Settings
            </Button>
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
