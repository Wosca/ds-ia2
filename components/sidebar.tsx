"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutGridIcon,
  TrophyIcon,
  UsersIcon,
  UserIcon,
  MoreHorizontal,
  LogOut,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />
        <SidebarInset className="w-full rounded-3xl overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const clerk = useClerk();

  // Helper function to determine if a theme is active
  const isActiveTheme = (themeName: string) => {
    if (themeName === "system") {
      return theme === "system";
    }
    return theme === themeName;
  };

  const mainItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      href: "/dashboard/labs",
      title: "Labs",
      icon: <LayoutGridIcon className="h-4 w-4" />,
    },
    {
      href: "/dashboard/tournaments",
      title: "Tournaments",
      icon: <TrophyIcon className="h-4 w-4" />,
    },
    {
      href: "/dashboard/teams",
      title: "Teams",
      icon: <UsersIcon className="h-4 w-4" />,
    },
  ];

  return (
    <>
      {/* Mobile trigger in the header - properly inside the SidebarProvider context */}
      <div className="fixed left-4 top-3 z-40 md:hidden">
        <SidebarTrigger className="mr-1 p-5" />
      </div>

      {/* Main sidebar with enhanced styling */}
      <UISidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <h1 className="text-xl font-bold">Esports Hub</h1>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Main navigation group */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {/* Add dropdown menu for more options */}
                      {item.title === "Teams" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                              <MoreHorizontal className="h-4 w-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard/teams/create">
                                Create New Team
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Manage Members</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}

                      {item.title === "Tournaments" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction>
                              <MoreHorizontal className="h-4 w-4" />
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem asChild>
                              <Link href="/dashboard/tournaments/watch-party">
                                Join Watch Party
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Register Team</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
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
                <Settings className="h-4 w-4" />
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
                      tooltip="Profile"
                    >
                      <Link href="/dashboard/profile">
                        <UserIcon className="h-4 w-4" />
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
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedIn>
                <SignedOut>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => clerk.openSignIn()}>
                      <UserIcon className="h-4 w-4" />
                      <span>Sign in</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SignedOut>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>

        {/* Rail for toggling sidebar */}
        <SidebarRail />
      </UISidebar>
    </>
  );
}
