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

export default function WatchPartyPage() {
  return (
    <div className="container max-w-2xl px-6 py-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard/tournaments">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Tournaments
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Create Watch Party</h1>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Name</label>
            <Input
              placeholder="e.g., Spring Showdown Watch Party"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Select Tournament</label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spring-showdown">Spring Showdown</SelectItem>
                <SelectItem value="fps-masters">FPS Masters</SelectItem>
                <SelectItem value="fighting-game">
                  Fighting Game Championship
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date & Time</label>
            <Input type="datetime-local" className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="e.g., Main Campus, Room 101"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 rounded-md border bg-transparent text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              placeholder="Describe your watch party..."
            />
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Create Watch Party
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
