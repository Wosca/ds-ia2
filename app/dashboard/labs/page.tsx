import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  CalendarIcon,
  UsersIcon,
  GamepadIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";

export default function LabsPage() {
  const sampleLabs = [
    {
      id: 1,
      name: "Lab A",
      date: "2025-04-20",
      teamName: "Team Alpha",
      genre: "FPS",
    },
    {
      id: 2,
      name: "Lab B",
      date: "2025-04-22",
      teamName: "Team Bravo",
      genre: "MOBA",
    },
    {
      id: 3,
      name: "Lab C",
      date: "2025-04-25",
      teamName: "Team Charlie",
      genre: "RPG",
    },
  ];

  return (
    <div className="container px-6 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Computer Lab Bookings
        </h1>
        <Button asChild>
          <Link
            href="/dashboard/labs/create"
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Book New Lab
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleLabs.map((lab) => (
          <div
            key={lab.id}
            className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div className="bg-accent/20 p-4 border-b">
              <h2 className="text-xl font-semibold">{lab.name}</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 opacity-70" />
                <span>{lab.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="h-4 w-4 opacity-70" />
                <span>{lab.teamName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GamepadIcon className="h-4 w-4 opacity-70" />
                <span>{lab.genre}</span>
              </div>
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
