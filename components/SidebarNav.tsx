import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavClient } from "./SidebarNavClient";
import React from "react";
import { getDashboardPages } from "@/lib/dashboardPages";

export async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pages = getDashboardPages();

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-y-hidden w-full">
        <SidebarNavClient categorizedUtilities={pages} />
        <SidebarInset className="w-full">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
