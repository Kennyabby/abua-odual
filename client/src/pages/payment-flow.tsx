import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Building2, Smartphone, Hash, Check, Loader2, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";

type PaymentStep = "category" | "details" | "method" | "card" | "processing" | "success";

export default function PaymentFlow() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [step, setStep] = useState<PaymentStep>("category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentData, setPaymentData] = useState({
    payerName: "",
    payerEmail: "",
    payerPhone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [rrr, setRrr] = useState("");

  const { data: categories } = useQuery({
    queryKey: ["/api/revenue-categories"],
  });

  const { data: enabledMethodsResponse } = useQuery({
    queryKey: ["/api/payment-methods", selectedCategory],
    enabled: !!selectedCategory,
  });

  const enabledPaymentMethods = enabledMethodsResponse?.methods || [];

  // Set first enabled method as default when enabled methods change
  useEffect(() => {
    if (enabledPaymentMethods.length > 0 && !enabledPaymentMethods.includes(paymentMethod)) {
      setPaymentMethod(enabledPaymentMethods[0]);
    } else if (enabledPaymentMethods.length === 0) {
      setPaymentMethod("");
    }
  }, [enabledPaymentMethods, paymentMethod]);

  const processMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/payments/process", data);
    },
    onSuccess: (data) => {
      setRrr(data.rrr);
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      setStep("success");
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setStep("method");
    },
  });

  const category = categories?.find((c: any) => c.id === selectedCategory);

  const handleContinueToDetails = () => {
    if (!selectedCategory) {
      toast({
        title: "Select a Category",
        description: "Please select a revenue category to continue",
        variant: "destructive",
      });
      return;
    }
    setStep("details");
  };

  const handleContinueToMethod = () => {
    if (!paymentData.payerName || !paymentData.payerEmail || !paymentData.payerPhone) {
      toast({
        title: "Complete Details",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setStep("method");
  };

  const handleContinueToPayment = () => {
    setStep("card");
  };

  const handleProcessPayment = async () => {
    if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
      toast({
        title: "Complete Payment Details",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return;
    }

    setStep("processing");

    await processMutation.mutateAsync({
      categoryId: selectedCategory,
      amount: category?.amount,
      paymentMethod,
      ...paymentData,
    });
  };

  const allPaymentMethods = [
    {
      id: "card",
      name: "Card Payment",
      description: "Pay with Debit/Credit Card",
      icon: CreditCard,
    },
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct bank transfer",
      icon: Building2,
    },
    {
      id: "ussd",
      name: "USSD",
      description: "Dial USSD code",
      icon: Hash,
    },
    {
      id: "mobile_money",
      name: "Mobile Money",
      description: "Pay via mobile wallet",
      icon: Smartphone,
    },
  ];

  // Filter payment methods based on what's enabled
  const paymentMethods = allPaymentMethods.filter(method => 
    enabledPaymentMethods.includes(method.id)
  );

  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold">Processing Payment...</h2>
              <p className="text-muted-foreground">
                Please wait while we process your transaction
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="py-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your payment has been processed successfully
                </p>
              </div>

              <div className="bg-muted p-6 rounded-md space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">RRR Number</p>
                  <p className="font-mono text-lg font-bold" data-testid="text-rrr">{rrr}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                  <p className="font-display text-2xl font-bold">
                    ₦{parseFloat(category?.amount || "0").toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment For</p>
                  <p className="font-medium">{category?.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button className="w-full" data-testid="button-download-receipt">
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setLocation("/citizen")}
                  data-testid="button-back-home"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Make Payment</h1>
          <p className="text-muted-foreground">
            Complete your payment in a few simple steps
          </p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {["category", "details", "method", "card"].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`h-0.5 flex-1 ${step === s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {step === "category" && (
          <Card>
            <CardHeader>
              <CardTitle>Select Revenue Category</CardTitle>
              <CardDescription>Choose what you want to pay for</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedCategory} onValueChange={setSelectedCategory}>
                <div className="space-y-3">
                  {categories?.filter((c: any) => c.isActive).map((cat: any) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-4 p-4 border rounded-md hover-elevate cursor-pointer"
                      data-testid={`radio-category-${cat.id}`}
                    >
                      <RadioGroupItem value={cat.id} id={cat.id} />
                      <div className="flex-1">
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-sm text-muted-foreground">{cat.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">{cat.department}</div>
                      </div>
                      <div className="font-display text-lg font-bold">
                        ₦{parseFloat(cat.amount).toLocaleString()}
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>

              <Button 
                className="w-full" 
                onClick={handleContinueToDetails}
                data-testid="button-continue-details"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "details" && (
          <Card>
            <CardHeader>
              <CardTitle>Payer Information</CardTitle>
              <CardDescription>Enter your contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={paymentData.payerName}
                  onChange={(e) => setPaymentData({ ...paymentData, payerName: e.target.value })}
                  data-testid="input-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={paymentData.payerEmail}
                  onChange={(e) => setPaymentData({ ...paymentData, payerEmail: e.target.value })}
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  value={paymentData.payerPhone}
                  onChange={(e) => setPaymentData({ ...paymentData, payerPhone: e.target.value })}
                  data-testid="input-phone"
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("category")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleContinueToMethod} className="flex-1" data-testid="button-continue-method">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "method" && (
          <Card>
            <CardHeader>
              <CardTitle>Select Payment Method</CardTitle>
              <CardDescription>Choose how you want to pay</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.length === 0 ? (
                <div className="p-6 text-center border rounded-md bg-muted/30">
                  <p className="text-sm font-medium mb-2">No Payment Methods Available</p>
                  <p className="text-xs text-muted-foreground">
                    Payment methods for this category have not been configured yet. Please contact support or try a different payment category.
                  </p>
                </div>
              ) : (
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="grid gap-3 md:grid-cols-2">
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-4 border rounded-md hover-elevate cursor-pointer"
                        data-testid={`radio-method-${method.id}`}
                      >
                        <RadioGroupItem value={method.id} id={method.id} />
                        <method.icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{method.name}</div>
                          <div className="text-xs text-muted-foreground">{method.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("details")} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleContinueToPayment} 
                  className="flex-1" 
                  disabled={!paymentMethod || paymentMethods.length === 0}
                  data-testid="button-continue-payment"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "card" && (
          <Card>
            <CardHeader>
              <CardTitle>Card Payment</CardTitle>
              <CardDescription>Enter your card details securely</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Amount to Pay</span>
                  <span className="font-display text-2xl font-bold">
                    ₦{parseFloat(category?.amount || "0").toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">{category?.name}</div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card">Card Number *</Label>
                <Input
                  id="card"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  data-testid="input-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    data-testid="input-expiry"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    maxLength={4}
                    type="password"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    data-testid="input-cvv"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("method")} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleProcessPayment} className="flex-1" data-testid="button-pay">
                  Pay ₦{parseFloat(category?.amount || "0").toLocaleString()}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
