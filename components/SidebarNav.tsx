"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  Moon,
  Sun,
  UserCircle,
  Settings,
  ChevronDown,
  ChevronUp,
  LogOut,
  HomeIcon,
  LayoutGridIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarNav />
        <SidebarInset className="w-full">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function SidebarNav() {
  const { setTheme, theme } = useTheme();
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to determine if a theme is active
  const isActiveTheme = (themeName: string) => {
    if (themeName === "system") {
      return theme === "system";
    }
    return theme === themeName;
  };

  // Define categories and menu items
  const categories = [
    {
      category: "Esports Tools",
      items: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <HomeIcon className="h-4 w-4" />,
        },
        {
          name: "Labs",
          href: "/dashboard/labs",
          icon: <LayoutGridIcon className="h-4 w-4" />,
        },
        {
          name: "Tournaments",
          href: "/dashboard/tournaments",
          icon: <TrophyIcon className="h-4 w-4" />,
        },
        {
          name: "Teams",
          href: "/dashboard/teams",
          icon: <UsersIcon className="h-4 w-4" />,
        },
      ],
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Esports Hub</h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {categories.map((category) => (
          <SidebarGroup key={category.category}>
            <SidebarGroupLabel>{category.category}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`)
                      }
                      tooltip={item.name}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        {/* Theme Selection with Framer Motion */}
        <div className="w-full px-2 mb-2">
          <Button
            variant="ghost"
            className="w-full justify-between"
            onClick={() => setIsThemeOpen(!isThemeOpen)}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <span>Theme</span>
            </div>
            {isThemeOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          <AnimatePresence initial={false}>
            {isThemeOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: {
                    height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                    opacity: { duration: 0.2, delay: 0.1 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: {
                    height: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
                    opacity: { duration: 0.2 },
                  },
                }}
                className="overflow-hidden"
              >
                <div className="space-y-1 p-1 mt-1 bg-sidebar-accent/50 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start pl-9 ${
                      isActiveTheme("light")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : ""
                    }`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start pl-9 ${
                      isActiveTheme("dark")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : ""
                    }`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start pl-9 ${
                      isActiveTheme("system")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : ""
                    }`}
                    onClick={() => setTheme("system")}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    System
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <SidebarSeparator />

        {/* User Controls */}
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SignedIn>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/profile"}
                  >
                    <Link href="/dashboard/profile">
                      <UserCircle className="h-5 w-5" />
                      <span>
                        {isLoaded && user
                          ? `${user.firstName || ""} ${user.lastName || ""}`
                          : "Profile"}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => clerk.signOut()}>
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedIn>
              <SignedOut>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => clerk.openSignIn()}>
                    <UserCircle className="h-5 w-5" />
                    <span>Sign in</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SignedOut>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
