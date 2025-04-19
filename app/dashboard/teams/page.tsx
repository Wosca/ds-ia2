"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateTeamDialog } from "@/components/create-team-dialog";
import { UsersIcon } from "lucide-react";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">My Teams</h1>
        <CreateTeamDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example Team Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Phoenix Blaze</CardTitle>
            <CardDescription>Valorant</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Competitive Valorant team focusing on strategic play and team
              coordination.
            </p>
            <div className="flex items-center mt-4 text-muted-foreground">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">5 Members</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Created Apr 10, 2025
            </p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quantum Raiders</CardTitle>
            <CardDescription>League of Legends</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Semi-professional LoL team competing in regional tournaments.
            </p>
            <div className="flex items-center mt-4 text-muted-foreground">
              <UsersIcon className="mr-2 h-4 w-4" />
              <span className="text-sm">5 Members</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Created Mar 15, 2025
            </p>
          </CardFooter>
        </Card>

        <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <h3 className="font-medium mb-2">Create a new team</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Form a new competitive roster
            </p>
            <CreateTeamDialog />
          </div>
        </Card>
      </div>
    </div>
  );
}
