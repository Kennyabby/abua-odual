import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"],
  });

  const filteredPayments = payments?.filter((payment: any) =>
    payment.rrr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.payerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "successful":
        return {
          variant: "default" as const,
          icon: CheckCircle2,
          color: "text-green-600",
        };
      case "pending":
        return {
          variant: "secondary" as const,
          icon: Clock,
          color: "text-yellow-600",
        };
      case "failed":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-600",
        };
      default:
        return {
          variant: "secondary" as const,
          icon: Clock,
          color: "text-gray-600",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Payments</h1>
        <p className="text-muted-foreground">
          View and track all payment transactions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by RRR or payer name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RRR</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount (₦)</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments?.map((payment: any) => {
                const statusConfig = getStatusConfig(payment.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                    <TableCell className="font-mono font-medium">
                      {payment.rrr}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{payment.payerName}</div>
                        <div className="text-xs text-muted-foreground">{payment.payerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {payment.invoiceNumber}
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {parseFloat(payment.amount).toLocaleString()}
                    </TableCell>
                    <TableCell className="capitalize">
                      {payment.paymentMethod.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(payment.transactionDate), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant} className="gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        data-testid={`button-download-${payment.id}`}
                        disabled={payment.status !== "successful"}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredPayments?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No payments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
