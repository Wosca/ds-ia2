import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LayoutGridIcon,
  TrophyIcon,
  UsersIcon,
  CalendarIcon,
} from "lucide-react";

export default function Dashboard() {
  const upcomingTournaments = [
    {
      id: 1,
      name: "Spring Showdown",
      date: "2025-05-01",
      game: "League of Legends",
    },
    { id: 2, name: "FPS Masters", date: "2025-06-15", game: "Counter-Strike" },
  ];

  const recentLabBookings = [
    { id: 1, name: "Lab A", date: "2025-04-20", teamName: "Team Alpha" },
    { id: 2, name: "Lab B", date: "2025-04-22", teamName: "Team Bravo" },
  ];

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <DashboardCard
          title="Computer Labs"
          subtitle="View & book labs"
          icon={<LayoutGridIcon className="h-6 w-6" />}
          href="/dashboard/labs"
        />
        <DashboardCard
          title="Tournaments"
          subtitle="Browse tournaments"
          icon={<TrophyIcon className="h-6 w-6" />}
          href="/dashboard/tournaments"
        />
        <DashboardCard
          title="Teams"
          subtitle="Manage your teams"
          icon={<UsersIcon className="h-6 w-6" />}
          href="/dashboard/teams"
        />
        <DashboardCard
          title="Watch Parties"
          subtitle="Organize events"
          icon={<CalendarIcon className="h-6 w-6" />}
          href="/dashboard/tournaments/watch-party"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Tournaments</h2>
            <Button variant="link" asChild>
              <Link href="/dashboard/tournaments">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {upcomingTournaments.map((tournament) => (
              <div key={tournament.id} className="border rounded-md p-4">
                <div className="font-medium">{tournament.name}</div>
                <div className="text-sm text-muted-foreground">
                  {tournament.game}
                </div>
                <div className="text-sm flex items-center mt-2">
                  <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
                  {tournament.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Lab Bookings</h2>
            <Button variant="link" asChild>
              <Link href="/dashboard/labs">View all</Link>
            </Button>
          </div>
          <div className="space-y-4">
            {recentLabBookings.map((booking) => (
              <div key={booking.id} className="border rounded-md p-4">
                <div className="font-medium">{booking.name}</div>
                <div className="text-sm text-muted-foreground">
                  {booking.teamName}
                </div>
                <div className="text-sm flex items-center mt-2">
                  <CalendarIcon className="h-4 w-4 mr-2 opacity-70" />
                  {booking.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  subtitle,
  icon,
  href,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block group border rounded-lg p-6 transition-colors hover:bg-accent"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium">{title}</div>
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </Link>
  );
}
