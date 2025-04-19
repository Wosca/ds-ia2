"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookLabDialog } from "@/components/book-lab-dialog";

export default function LabsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Practice Labs</h1>
        <BookLabDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Lab Cards */}
        <Card>
          <CardHeader>
            <CardTitle>CS:GO Practice Lab</CardTitle>
            <CardDescription>
              5v5 competitive practice environment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Open 24/7 for team practice sessions with voice communication and
              match replay analysis.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">5-10 players</p>
            <BookLabDialog />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valorant Strategy Lab</CardTitle>
            <CardDescription>Tactical planning and execution</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Designed for teams to practice set plays, utility usage, and
              post-plant scenarios.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">2-10 players</p>
            <BookLabDialog />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>League of Legends Scrim Room</CardTitle>
            <CardDescription>Team scrimmage environment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Dedicated space for 5v5 scrims with coaching tools and replay
              analysis.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">10 players</p>
            <BookLabDialog />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
