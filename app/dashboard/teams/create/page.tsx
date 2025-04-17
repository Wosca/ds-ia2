import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function CreateTeamPage() {
  // TODO: Replace sample state with real form state and DB insert
  return (
    <div className="container max-w-2xl px-6 py-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard/teams">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Teams
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create Esports Team</h1>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input placeholder="e.g., Team Alpha" className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Genre</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FPS">FPS</SelectItem>
                <SelectItem value="MOBA">MOBA</SelectItem>
                <SelectItem value="RPG">RPG</SelectItem>
                <SelectItem value="RTS">RTS</SelectItem>
                <SelectItem value="Fighting">Fighting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Team Description</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-transparent text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="Describe your team..."
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Create Team
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
