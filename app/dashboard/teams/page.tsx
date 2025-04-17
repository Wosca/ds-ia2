import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, GamepadIcon, PencilIcon, TrashIcon } from "lucide-react";

export default function TeamsPage() {
  const sampleTeams = [
    { id: 1, name: "Team Alpha", genre: "FPS", members: 5 },
    { id: 2, name: "Team Bravo", genre: "MOBA", members: 4 },
    { id: 3, name: "Team Charlie", genre: "RPG", members: 6 },
  ];

  return (
    <div className="container px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Esports Teams</h1>
        <Button asChild>
          <Link
            href="/dashboard/teams/create"
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create New Team
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleTeams.map((team) => (
          <div
            key={team.id}
            className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="bg-secondary p-4 border-b">
              <h2 className="text-xl font-semibold">{team.name}</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <GamepadIcon className="h-4 w-4 opacity-70" />
                <span className="text-sm">Genre: {team.genre}</span>
              </div>
              <div className="text-sm">Members: {team.members}</div>
            </div>
            <div className="p-4 pt-2 border-t flex gap-2 justify-end">
              <Button variant="outline" size="sm" className="gap-1">
                <PencilIcon className="h-3.5 w-3.5" />
                Update
              </Button>
              <Button variant="destructive" size="sm" className="gap-1">
                <TrashIcon className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
