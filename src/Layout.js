import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  User, 
  Utensils, 
  Dumbbell, 
  TrendingUp, 
  Target,
  Sparkles
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: User,
  },
  {
    title: "Meal Plans",
    url: createPageUrl("MealPlans"),
    icon: Utensils,
  },
  {
    title: "Workouts",
    url: createPageUrl("Workouts"),
    icon: Dumbbell,
  },
  {
    title: "Progress",
    url: createPageUrl("Progress"),
    icon: TrendingUp,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <Link to={createPageUrl("Dashboard")} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">FitGenius</h1>
                <p className="text-xs text-slate-500">AI-Powered Fitness</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          isActive={isActive}
                          className={`w-full ${isActive ? 'bg-gradient-to-r from-emerald-50 to-blue-50 text-emerald-700 border-r-2 border-emerald-500' : 'hover:bg-slate-50'}`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors">
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                            <span className={`font-medium ${isActive ? 'text-emerald-700' : 'text-slate-700'}`}>
                              {item.title}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4" />
              <span>Powered by AI</span>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200 p-4 md:hidden">
            <SidebarTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10" />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}