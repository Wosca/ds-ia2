"use client";
import Link from "next/link";
import { ArrowRight, Trophy, Users, Laptop, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import NoAuth from "./NoAuth";
import { Suspense } from "react";

export default function Home() {
  const clerk = useClerk();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">EsportsHub</span>
          </div>
          <nav className="flex items-center gap-4">
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:underline"
              >
                Dashboard
              </Link>
              <Button onClick={() => clerk.signOut()}>Sign Out</Button>
            </SignedIn>
            <SignedOut>
              <Button onClick={() => clerk.openSignIn()}>Sign In</Button>
            </SignedOut>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Suspense>
          <NoAuth />
        </Suspense>
        <section className="py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  School Esports Management Platform
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Create teams, book computer labs, join tournaments, and
                  organize watch parties for your school esports community.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                  <Button className="gap-1">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">Learn more</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Users className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Create Teams</h3>
              <p className="text-muted-foreground">
                Form your esports team and compete in school tournaments.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Laptop className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Book Labs</h3>
              <p className="text-muted-foreground">
                Reserve computer labs for practice and competitions.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Trophy className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Join Tournaments</h3>
              <p className="text-muted-foreground">
                Participate in various esports tournaments across different
                games.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 border rounded-lg">
              <Gamepad2 className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Watch Parties</h3>
              <p className="text-muted-foreground">
                Create and join watch parties for major esports events.
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} EsportsHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
