import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  DollarSign,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["admin", "secretario", "tesoureiro", "voluntario"],
  },
  {
    title: "Voluntários",
    url: "/voluntarios",
    icon: UserCheck,
    roles: ["admin", "secretario"],
  },
  {
    title: "Assistidos",
    url: "/assistidos",
    icon: Users,
    roles: ["admin", "secretario"],
  },
];

const financeiroItems = [
  {
    title: "Contribuições",
    url: "/contribuicoes",
    icon: DollarSign,
    roles: ["admin", "tesoureiro"],
  },
  {
    title: "Movimentações",
    url: "/movimentacoes",
    icon: FileText,
    roles: ["admin", "tesoureiro"],
  },
  {
    title: "Notas Fiscais",
    url: "/notas-fiscais",
    icon: Receipt,
    roles: ["admin", "tesoureiro"],
  },
];

const adminItems = [
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: BarChart3,
    roles: ["admin", "tesoureiro"],
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
    roles: ["admin"],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, logout } = useAuth();
  const collapsed = state === "collapsed";

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  const filteredMenuItems = menuItems.filter((item) => hasAccess(item.roles));
  const filteredFinanceiroItems = financeiroItems.filter((item) =>
    hasAccess(item.roles)
  );
  const filteredAdminItems = adminItems.filter((item) => hasAccess(item.roles));

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4">
          <h1 className={`font-bold text-xl text-sidebar-foreground ${collapsed ? "hidden" : ""}`}>
            SERFO
          </h1>
          {collapsed && (
            <div className="text-sidebar-foreground font-bold text-lg">S</div>
          )}
        </div>

        <Separator />

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <NavLink to={item.url} end>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {filteredFinanceiroItems.length > 0 && (
          <>
            <Separator />
            <SidebarGroup>
              <SidebarGroupLabel>Financeiro</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredFinanceiroItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <NavLink to={item.url}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {filteredAdminItems.length > 0 && (
          <>
            <Separator />
            <SidebarGroup>
              <SidebarGroupLabel>Administração</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredAdminItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <NavLink to={item.url}>
                            <item.icon className="h-4 w-4" />
                            {!collapsed && <span>{item.title}</span>}
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-2">
          {!collapsed && user && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium text-sidebar-foreground">{user.nome}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={logout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Sair</span>}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
