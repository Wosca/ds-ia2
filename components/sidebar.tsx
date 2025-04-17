"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LayoutGridIcon,
  TrophyIcon,
  UsersIcon,
  UserIcon,
  MenuIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
    icon: React.ReactNode;
  }[];
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLElement>) {
  const items = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/labs",
      title: "Labs",
      icon: <LayoutGridIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/tournaments",
      title: "Tournaments",
      icon: <TrophyIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/teams",
      title: "Teams",
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      href: "/dashboard/profile",
      title: "Profile",
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[240px]">
          <div className="px-2 py-6">
            <h2 className="text-lg font-bold mb-5 px-4">Esports Hub</h2>
            <SidebarNav items={items} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex md:flex-col h-screen w-[240px] border-r",
          className
        )}
      >
        <div className="px-4 py-6">
          <h2 className="text-xl font-bold mb-5">Esports Hub</h2>
          <SidebarNav items={items} />
        </div>
      </div>
    </>
  );
}

function SidebarNav({ items, className }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
