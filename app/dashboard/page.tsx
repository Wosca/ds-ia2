import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy, Users, Laptop, Gamepad2 } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName || "User"}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Teams you&apos;ve created or joined
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Bookings</CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Upcoming lab bookings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tournaments</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              Available tournaments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Watch Parties</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              Upcoming watch parties
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tournaments</CardTitle>
            <CardDescription>
              Tournaments happening in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">
                    Spring League of Legends Championship
                  </p>
                  <p className="text-sm text-muted-foreground">
                    May 15, 2025 • MOBA • $500 Prize
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Rocket League Tournament</p>
                  <p className="text-sm text-muted-foreground">
                    May 22, 2025 • Sports • $300 Prize
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Lab Bookings</CardTitle>
            <CardDescription>Your recent computer lab bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Laptop className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Lab A - Team Practice</p>
                  <p className="text-sm text-muted-foreground">
                    May 10, 2025 • Rocket League • Team Boost
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Laptop className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">Lab C - Tournament Prep</p>
                  <p className="text-sm text-muted-foreground">
                    May 12, 2025 • League of Legends • Team Nexus
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
