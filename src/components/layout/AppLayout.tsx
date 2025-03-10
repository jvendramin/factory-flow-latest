
import React from "react";
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarSection, 
  SidebarItem,
  SidebarTrigger,
  SidebarFooter 
} from "@/components/ui/collapsible-sidebar";
import { 
  LayoutGrid, 
  Settings, 
  Activity, 
  Box, 
  Shield, 
  Code, 
  Zap, 
  CreditCard, 
  Archive,
  SunMoon
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useTheme } from "@/components/theme/theme-provider";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-sidebar">
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <Box size={20} className="text-primary" />
            </div>
            <span className="ml-2 font-semibold text-sidebar-foreground">Factory Flow</span>
          </div>
        </SidebarHeader>
        
        <div className="flex flex-col h-[calc(100%-8rem)]">
          <SidebarSection title="GENERAL">
            <SidebarItem 
              icon={LayoutGrid} 
              active={location.pathname === "/"} 
            >
              Dashboard
            </SidebarItem>
            <SidebarItem icon={Activity}>Transactions</SidebarItem>
            <SidebarItem icon={Activity}>Metrics</SidebarItem>
            <SidebarItem icon={Shield}>Security</SidebarItem>
            <SidebarItem icon={Code}>API</SidebarItem>
            <SidebarItem icon={Zap}>Quick Setup</SidebarItem>
            <SidebarItem icon={CreditCard}>Payment Links</SidebarItem>
            <SidebarItem icon={Archive}>Archive</SidebarItem>
          </SidebarSection>
        </div>
        
        <SidebarFooter>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-xs font-medium">MB</span>
              </div>
              <span className="ml-2 text-sm font-medium">Mark Bannert</span>
            </div>
            <button 
              onClick={toggleTheme}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <SunMoon size={18} />
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      <SidebarTrigger className="top-4 left-[17rem] z-20" />
      
      <main className="flex-1 bg-background rounded-l-3xl shadow-xl overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
