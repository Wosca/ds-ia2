"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { TrophyIcon, UsersIcon, LayoutGridIcon } from "lucide-react";
import { AuthModal } from "@/components/auth-modal";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"sign-in" | "sign-up">("sign-in");
  const pathname = usePathname();

  const isInDashboard = pathname?.startsWith("/dashboard");

  const openModal = (mode: "sign-in" | "sign-up") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleMode = () => {
    setAuthMode(authMode === "sign-in" ? "sign-up" : "sign-in");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Only show on non-dashboard pages */}
      {!isInDashboard && (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            {/* Logo placeholder */}
            <div className="font-bold text-xl">Esports Hub</div>

            <div className="flex items-center gap-4">
              <SignedIn>
                {/* Show user button when signed in */}
                <div className="flex items-center gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <SignedOut>
                {/* Show sign in/up buttons when signed out */}
                <Button variant="ghost" onClick={() => openModal("sign-in")}>
                  Sign In
                </Button>
                <Button onClick={() => openModal("sign-up")}>Sign Up</Button>
              </SignedOut>
            </div>
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            The Ultimate Esports <span className="text-primary">Hub</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Manage your esports teams, book computer labs, and join tournaments
            all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedIn>
              <Button size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <Button size="lg" onClick={() => openModal("sign-up")}>
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => openModal("sign-in")}
              >
                Sign In
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<UsersIcon className="h-8 w-8" />}
              title="Team Management"
              description="Create and manage your esports teams with ease. Track membership and organize your roster."
            />
            <FeatureCard
              icon={<LayoutGridIcon className="h-8 w-8" />}
              title="Lab Bookings"
              description="Book computer labs for practice sessions and team meetings with our easy scheduling system."
            />
            <FeatureCard
              icon={<TrophyIcon className="h-8 w-8" />}
              title="Tournament Tracking"
              description="Stay up to date with upcoming tournaments and organize watch parties with your team."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to level up your esports experience?
          </h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
            Join thousands of players and teams who are already using Esports
            Hub.
          </p>
          <SignedIn>
            <Button size="lg" variant="secondary" asChild className="px-8">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => openModal("sign-up")}
              className="px-8"
            >
              Create your account
            </Button>
          </SignedOut>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-bold text-xl">Esports Hub</div>
            <p className="text-muted-foreground mt-4 md:mt-0">
              © {new Date().getFullYear()} Esports Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <SignedOut>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeModal}
          mode={authMode}
          onToggleMode={toggleMode}
        />
      </SignedOut>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border rounded-lg p-6 bg-background">
      <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
