import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

export default function CreateLabPage() {
  // TODO: Replace sample state with real form state and DB insert
  return (
    <div className="container max-w-2xl px-6 py-8 mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/dashboard/labs">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Labs
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Book a Computer Lab</h1>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Lab Name</label>
            <Input placeholder="e.g., Lab A" className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Team Name</label>
            <Input placeholder="Your Team Name" className="w-full" />
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

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Submit Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
