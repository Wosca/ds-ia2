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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SignedIn, SignedOut, useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface SidebarNavClientProps {
  categorizedUtilities: {
    name: string;
    icon: React.JSX.Element;
    href: string;
  }[];
}

export function SidebarLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <SidebarNavClient categorizedUtilities={[]} />{" "}
        <SidebarInset className="w-full">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function SidebarNavClient({
  categorizedUtilities,
}: SidebarNavClientProps) {
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

  const isRoot = pathname === "/";

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <h1 className={`text-xl font-bold`}>
              {isRoot ? (
                "eSports Hub"
              ) : (
                <div className="flex items-center gap-2">
                  <HomeIcon /> Home{" "}
                </div>
              )}
            </h1>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {categorizedUtilities.map((category) => (
          <SidebarMenu key={category.name}>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === category.href}
                tooltip={category.name}
              >
                <Link href={category.href}>
                  {category.icon}
                  <span>{category.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
                <div
                  className={`space-y-1 p-2 mt-1 rounded-md bg-sidebar-accent/50`}
                >
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
                  <SidebarMenuButton asChild>
                    <div>
                      <Link href="/profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        {isLoaded && user
                          ? `${user.firstName} ${user.lastName}`
                          : "Profile"}
                      </Link>
                    </div>
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
