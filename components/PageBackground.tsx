"use client";

import { ReactNode } from "react";

export default function PageBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col gap-8 py-8 px-4 sm:px-6 md:px-10 relative overflow-x-hidden overflow-y-auto">
      {children}
    </div>
  );
}
