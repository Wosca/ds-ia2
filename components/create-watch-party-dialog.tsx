"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addHours } from "date-fns";

export function CreateWatchPartyDialog() {
  const [open, setOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [streamLink, setStreamLink] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState({
    from: new Date(),
    to: addHours(new Date(), 3),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would handle the watch party creation
    console.log("Watch party created:", {
      eventName,
      streamLink,
      date,
      description,
    });

    // Reset form and close dialog
    setEventName("");
    setStreamLink("");
    setDescription("");
    setDate({
      from: new Date(),
      to: addHours(new Date(), 3),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Watch Party</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Watch Party</DialogTitle>
            <DialogDescription>
              Set up a watch party for tournaments or esports events with your
              team.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid items-center gap-4">
              <Label htmlFor="eventName">Event Name</Label>
              <Input
                id="eventName"
                placeholder="e.g., ESL One Finals Watch Party"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="streamLink">Stream Link</Label>
              <Input
                id="streamLink"
                type="url"
                placeholder="e.g., https://twitch.tv/esl"
                value={streamLink}
                onChange={(e) => setStreamLink(e.target.value)}
                required
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="date">Event Period</Label>
              <DateRangePicker
                initialDateFrom={date.from}
                initialDateTo={date.to}
                onUpdate={({ range }) => {
                  setDate({
                    from: range.from,
                    to: range.to || range.from,
                  });
                }}
                align="start"
                showCompare={false}
              />
            </div>
            <div className="grid items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Additional details about the watch party"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create Watch Party</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
