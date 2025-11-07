import { Home, Receipt, Users, BarChart3, FileText, Settings, Shield, DollarSign } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { getCurrentUser, logout, getRoleLabel } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const adminNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
    roles: ["admin", "finance_officer", "auditor"],
  },
  {
    title: "Revenue Sources",
    url: "/revenue-sources",
    icon: DollarSign,
    roles: ["admin", "finance_officer"],
  },
  {
    title: "Invoices",
    url: "/invoices",
    icon: FileText,
    roles: ["admin", "finance_officer"],
  },
  {
    title: "Payments",
    url: "/payments",
    icon: Receipt,
    roles: ["admin", "finance_officer", "auditor"],
  },
  {
    title: "Taxpayers",
    url: "/taxpayers",
    icon: Users,
    roles: ["admin", "finance_officer"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
    roles: ["admin", "finance_officer", "auditor"],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const currentUser = getCurrentUser();

  const filteredItems = adminNavItems.filter(item => 
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold">IGR Portal</h2>
            <p className="text-xs text-muted-foreground">Abua/Odual LGA</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-6">
        {currentUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {currentUser.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{currentUser.fullName}</p>
                <Badge variant="secondary" className="text-xs mt-1">
                  {getRoleLabel(currentUser.role)}
                </Badge>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={logout}
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
