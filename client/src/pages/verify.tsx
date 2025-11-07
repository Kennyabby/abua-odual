import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle2, XCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";

export default function Verify() {
  const { toast } = useToast();
  const [rrr, setRrr] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const verifyMutation = useMutation({
    mutationFn: async (rrr: string) => {
      return apiRequest("POST", "/api/payments/verify", { rrr });
    },
    onSuccess: (data) => {
      setVerificationResult(data);
    },
    onError: () => {
      toast({
        title: "Verification Failed",
        description: "Could not verify the RRR number. Please check and try again.",
        variant: "destructive",
      });
      setVerificationResult(null);
    },
  });

  const handleVerify = () => {
    if (!rrr.trim()) {
      toast({
        title: "Enter RRR Number",
        description: "Please enter a valid RRR number to verify",
        variant: "destructive",
      });
      return;
    }
    verifyMutation.mutate(rrr);
  };

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Shield className="h-8 w-8" />
            </div>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">Payment Verification</h1>
          <p className="text-muted-foreground">
            Verify the authenticity of payment receipts using RRR number
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Enter RRR Number</CardTitle>
            <CardDescription>
              Enter the Remita Retrieval Reference number from your receipt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rrr">RRR Number</Label>
              <div className="flex gap-3">
                <Input
                  id="rrr"
                  placeholder="Enter RRR number..."
                  value={rrr}
                  onChange={(e) => setRrr(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                  className="font-mono"
                  data-testid="input-rrr"
                />
                <Button 
                  onClick={handleVerify} 
                  disabled={verifyMutation.isPending}
                  data-testid="button-verify"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {verifyMutation.isPending && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                </div>
                <p className="text-muted-foreground">Verifying payment...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {verificationResult && !verifyMutation.isPending && (
          <Card>
            <CardContent className="py-8">
              {verificationResult.found ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-3 text-primary">
                    <CheckCircle2 className="h-12 w-12" />
                    <div>
                      <h2 className="font-display text-2xl font-bold">Payment Verified</h2>
                      <p className="text-sm text-muted-foreground">This payment is authentic and valid</p>
                    </div>
                  </div>

                  <div className="space-y-4 p-6 bg-muted rounded-md">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">RRR Number</p>
                        <p className="font-mono font-semibold">{verificationResult.rrr}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                        <p className="font-display text-xl font-bold">
                          ₦{parseFloat(verificationResult.amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payer Name</p>
                        <p className="font-medium">{verificationResult.payerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Date</p>
                        <p className="font-medium">
                          {format(new Date(verificationResult.transactionDate), "MMM dd, yyyy HH:mm")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                        <p className="font-medium capitalize">
                          {verificationResult.paymentMethod.replace(/_/g, " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                        <p className="font-medium text-primary">Successful</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
                      <p className="font-mono font-medium">{verificationResult.invoiceNumber}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <XCircle className="h-12 w-12 text-destructive" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold mb-2">Payment Not Found</h2>
                    <p className="text-muted-foreground">
                      No payment record found for RRR: <span className="font-mono font-semibold">{rrr}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Please check the RRR number and try again
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">How to Verify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>1. Locate the RRR number on your payment receipt</p>
            <p>2. Enter the RRR number in the field above</p>
            <p>3. Click "Verify" to check the payment status</p>
            <p>4. Review the payment details if verification is successful</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
