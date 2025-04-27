"use client";

import { useClerk } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function NoAuth() {
  const searchParams = useSearchParams();
  const clerk = useClerk();

  useEffect(() => {
    // Check if the user was redirected due to authentication requirement
    if (searchParams.get("authRequired") === "true") {
      toast.error("You need to be signed in to access that page", {
        action: {
          label: "Sign In",
          onClick: () => {
            clerk.openSignIn();
          },
        },
      });
    }
  }, []);
  return null;
}
