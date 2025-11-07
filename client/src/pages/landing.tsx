import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Building2,
  Users,
  FileText,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Building2,
      title: "Business Registration",
      description: "Register your business on our platform to access all payment services and stay compliant with LGA regulations.",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: Users,
      title: "Citizen Portal",
      description: "Individual citizens can make payments for taxes, levies, and fees with ease using our secure online platform.",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: FileText,
      title: "Invoice Management",
      description: "View and pay your pending invoices online. Download receipts and track your payment history in one place.",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Options",
      description: "Pay using Card, Bank Transfer, USSD, or Mobile Money through our secure Remita payment integration.",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Account or Register Business",
      description: "Citizens can login directly. Businesses must complete the registration form with valid CAC/BN documents.",
    },
    {
      number: "2",
      title: "Select Payment Category",
      description: "Choose the type of payment (taxes, levies, fees, permits) from our comprehensive revenue categories.",
    },
    {
      number: "3",
      title: "Generate RRR Number",
      description: "Our system generates a unique Remita Retrieval Reference (RRR) for your transaction.",
    },
    {
      number: "4",
      title: "Complete Payment",
      description: "Use any of our approved payment methods to complete your transaction securely.",
    },
  ];

  const warnings = [
    {
      icon: AlertTriangle,
      title: "Beware of Fraudulent Agents",
      description: "Only make payments through this official IGR portal. Do not give money to individuals claiming to be government agents.",
    },
    {
      icon: Shield,
      title: "Verify All Transactions",
      description: "Always verify your RRR number and receipt on our verification page. Keep your receipt safe for future reference.",
    },
    {
      icon: CheckCircle2,
      title: "Official Channels Only",
      description: "This website (*.replit.dev or official domain) is the only authorized platform for Abua/Odual LGA online payments.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-lg sm:text-xl font-bold">IGR Payment Portal</h1>
                <p className="text-xs text-muted-foreground">Abua/Odual Local Government Area</p>
              </div>
            </div>
            <Button onClick={() => setLocation("/login")} data-testid="button-login-nav">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="text-sm">
              Official Revenue Collection Portal
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Pay Your Taxes & Levies
              <br />
              <span className="text-primary">Securely Online</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The official Internally Generated Revenue (IGR) payment platform for Abua/Odual Local Government Area.
              Fast, secure, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={() => setLocation("/business/register")} data-testid="button-register-business">
                <Building2 className="h-5 w-5 mr-2" />
                Register Your Business
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("/login")} data-testid="button-citizen-login">
                <Users className="h-5 w-5 mr-2" />
                Citizen Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Platform Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to manage your tax obligations and business registrations
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate">
                  <CardHeader>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-md ${feature.bgColor} mb-4`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                Simple steps to complete your payments online
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex gap-4 items-start">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {step.number}
                      </div>
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-5 w-5 text-muted-foreground hidden sm:block" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fraud Prevention Section */}
      <section className="py-12 sm:py-20 border-y bg-destructive/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Important Safety Information</h2>
              <p className="text-muted-foreground">
                Protect yourself from fraudulent agents and unauthorized transactions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {warnings.map((warning, index) => (
                <Card key={index} className="border-destructive/20">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-destructive/10 mb-4">
                      <warning.icon className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle className="text-base">{warning.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {warning.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-card rounded-lg border border-destructive/20">
              <p className="text-center text-sm">
                <strong>Report Suspicious Activity:</strong> If you encounter anyone asking for cash payments or
                claiming to process payments outside this portal, please contact our office immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Need Help?</h2>
              <p className="text-muted-foreground">
                Our team is here to assist you with any questions or concerns
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <Phone className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-sm text-muted-foreground">+234 803 000 0000</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <Mail className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-sm text-muted-foreground">igr@abuaodual.gov.ng</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center space-y-2">
                  <MapPin className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-semibold">Office</h3>
                  <p className="text-sm text-muted-foreground">LGA Secretariat, Abua</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Abua/Odual Local Government Area. All rights reserved.</p>
            <p className="mt-2">Official Internally Generated Revenue (IGR) Portal</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
