import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  TrophyIcon,
  CalendarIcon,
  UsersIcon,
  ArrowRightIcon,
} from "lucide-react";

export default function TournamentsPage() {
  const sampleTournaments = [
    {
      id: 1,
      name: "Spring Showdown",
      date: "2025-05-01",
      game: "League of Legends",
      teams: 16,
      prize: "$10,000",
    },
    {
      id: 2,
      name: "FPS Masters",
      date: "2025-06-15",
      game: "Counter-Strike",
      teams: 8,
      prize: "$5,000",
    },
    {
      id: 3,
      name: "Fighting Game Championship",
      date: "2025-07-10",
      game: "Street Fighter 6",
      teams: 32,
      prize: "$15,000",
    },
  ];

  return (
    <div className="container px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Tournaments</h1>
        <Button asChild>
          <Link
            href="/dashboard/tournaments/watch-party"
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Create Watch Party
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleTournaments.map((tournament) => (
          <div
            key={tournament.id}
            className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="relative bg-primary/10 p-4 border-b">
              <div className="absolute top-4 right-4 p-1 rounded-full bg-primary/20">
                <TrophyIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold pr-8">{tournament.name}</h2>
              <p className="text-sm text-muted-foreground">{tournament.game}</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span>{tournament.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 opacity-70" />
                <span>{tournament.teams} Teams</span>
              </div>
              <div className="text-sm font-medium">
                Prize Pool: {tournament.prize}
              </div>
            </div>
            <div className="p-4 pt-2 border-t flex justify-end">
              <Button variant="ghost" size="sm" className="gap-1">
                View Details
                <ArrowRightIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
