"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { GamepadIcon } from "lucide-react";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center justify-center rounded-md bg-primary p-1.5">
        <GamepadIcon className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="font-bold text-lg">Esports Hub</span>
    </Link>
  );
}
