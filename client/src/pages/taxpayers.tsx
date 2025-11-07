import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Plus, Search, Eye, User, Building2 } from "lucide-react";

export default function Taxpayers() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: taxpayers, isLoading } = useQuery({
    queryKey: ["/api/taxpayers"],
  });

  const filteredTaxpayers = taxpayers?.filter((taxpayer: any) =>
    taxpayer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taxpayer.taxpayerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    taxpayer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Taxpayers</h1>
          <p className="text-muted-foreground">
            Manage taxpayer profiles and information
          </p>
        </div>
        <Button data-testid="button-add-taxpayer">
          <Plus className="h-4 w-4 mr-2" />
          Add Taxpayer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search taxpayers..."
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
                <TableHead>Taxpayer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTaxpayers?.map((taxpayer: any) => (
                <TableRow key={taxpayer.id} data-testid={`row-taxpayer-${taxpayer.id}`}>
                  <TableCell className="font-mono font-medium">
                    {taxpayer.taxpayerId}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                        taxpayer.type === "individual" ? "bg-blue-50 dark:bg-blue-950" : "bg-purple-50 dark:bg-purple-950"
                      }`}>
                        {taxpayer.type === "individual" ? (
                          <User className={`h-4 w-4 ${taxpayer.type === "individual" ? "text-blue-600" : "text-purple-600"}`} />
                        ) : (
                          <Building2 className={`h-4 w-4 ${taxpayer.type === "individual" ? "text-blue-600" : "text-purple-600"}`} />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{taxpayer.fullName}</div>
                        {taxpayer.businessName && (
                          <div className="text-xs text-muted-foreground">{taxpayer.businessName}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {taxpayer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{taxpayer.email}</div>
                      <div className="text-muted-foreground">{taxpayer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-xs truncate">
                    {taxpayer.address}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" data-testid={`button-view-${taxpayer.id}`}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTaxpayers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No taxpayers found
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
