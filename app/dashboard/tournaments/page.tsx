"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreateWatchPartyDialog } from "@/components/create-watch-party-dialog";
import { CalendarIcon, UsersIcon, TrophyIcon } from "lucide-react";

export default function TournamentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
        <div className="flex gap-2">
          <CreateWatchPartyDialog />
          <Button variant="outline">Register Team</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upcoming tournaments */}
        <Card>
          <CardHeader>
            <CardTitle>ESL Pro League Season 26</CardTitle>
            <CardDescription>CS:GO - Professional</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Top teams from around the world compete in the premier CS:GO
              league.
            </p>
            <div className="flex items-center text-muted-foreground mb-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Starts May 15, 2025</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <TrophyIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">$1,000,000 Prize Pool</span>
            </div>
          </CardContent>
          <CardFooter>
            <CreateWatchPartyDialog />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valorant Champions Tour</CardTitle>
            <CardDescription>Valorant - Professional</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              The pinnacle of Valorant esports featuring the best teams in the
              world.
            </p>
            <div className="flex items-center text-muted-foreground mb-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Starts June 2, 2025</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <TrophyIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">$2,000,000 Prize Pool</span>
            </div>
          </CardContent>
          <CardFooter>
            <CreateWatchPartyDialog />
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>University Gaming League</CardTitle>
            <CardDescription>Multiple Games - Collegiate</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Collegiate esports competition open to university teams across
              multiple game titles.
            </p>
            <div className="flex items-center text-muted-foreground mb-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">Starts July 10, 2025</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">32 Universities</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Register Team</Button>
            <CreateWatchPartyDialog />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
