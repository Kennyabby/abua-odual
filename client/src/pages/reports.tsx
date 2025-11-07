import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [reportType, setReportType] = useState("daily");
  const [department, setDepartment] = useState("all");

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["/api/reports", reportType, department],
  });

  const reportTypes = [
    { value: "daily", label: "Daily Revenue Report" },
    { value: "weekly", label: "Weekly Revenue Report" },
    { value: "monthly", label: "Monthly Revenue Report" },
    { value: "quarterly", label: "Quarterly Revenue Report" },
    { value: "annual", label: "Annual Revenue Report" },
  ];

  const departments = [
    { value: "all", label: "All Departments" },
    { value: "health", label: "Health Services" },
    { value: "agriculture", label: "Agriculture" },
    { value: "transport", label: "Transport & Works" },
    { value: "trade", label: "Trade & Commerce" },
    { value: "environment", label: "Environment" },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-2">Reports</h1>
        <p className="text-muted-foreground">
          Generate and export revenue reports
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Report Configuration</CardTitle>
            <CardDescription>Select report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" data-testid="select-report-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department" data-testid="select-department">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" data-testid="button-generate">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>

            <Button variant="outline" className="w-full" data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>
              {reportTypes.find(t => t.value === reportType)?.label} - {format(new Date(), "MMMM dd, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Total Collections</p>
                    <p className="font-display text-2xl font-bold">
                      ₦{(reportData?.totalCollections || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                    <p className="font-display text-2xl font-bold">
                      {reportData?.totalTransactions || 0}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                    <p className="font-display text-2xl font-bold">
                      {reportData?.successRate || 0}%
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Revenue Breakdown</h3>
                  <div className="space-y-2">
                    {reportData?.breakdown?.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <span className="text-sm">{item.category}</span>
                        <span className="font-mono font-semibold">
                          ₦{item.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <p>Generated on {format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}</p>
                  <p>Report ID: RPT-{Date.now()}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
