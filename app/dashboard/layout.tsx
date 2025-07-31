"use client";

import { SidebarProvider } from "../components/ui/sidebar";
import { CustomSidebarProvider, useCustomSidebar } from "../context/SidebarContext";
import React from "react";
import { AppSidebar } from "./components/AppSidebar";
import { cn } from "../lib/utils";

type Props = {
  children: React.ReactNode;
};

const DashboardContent = ({ children }: Props) => {
  const { isCollapsed } = useCustomSidebar();
  
  return (
    <main className={cn(
      "w-full min-h-screen bg-gray-50 p-6 transition-all duration-300 ease-in-out",
      isCollapsed ? "ml-[80px]" : "ml-[266px]"
    )}>
      {children}
    </main>
  );
};

const DashboardLayout = ({ children }: Props) => {
  return (
    <CustomSidebarProvider>
      <SidebarProvider>
        <AppSidebar />
        <DashboardContent>
          {children}
        </DashboardContent>
      </SidebarProvider>
    </CustomSidebarProvider>
  );
};

export default DashboardLayout; 