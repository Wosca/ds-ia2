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
import { addDays } from "date-fns";

export function BookLabDialog() {
  const [open, setOpen] = useState(false);
  const [labName, setLabName] = useState("");
  const [participants, setParticipants] = useState("");
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Here you would handle the lab booking
    console.log("Lab booked:", { labName, date, participants });

    // Reset form and close dialog
    setLabName("");
    setParticipants("");
    setDate({
      from: new Date(),
      to: addDays(new Date(), 1),
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Book Lab</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Book Practice Lab</DialogTitle>
            <DialogDescription>
              Reserve a practice lab for your team or individual training.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="labName" className="col-span-4">
                Lab Name
              </Label>
              <Input
                id="labName"
                placeholder="e.g., CS:GO Practice Lab"
                className="col-span-4"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="col-span-4">
                Reservation Period
              </Label>
              <div className="col-span-4">
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="participants" className="col-span-4">
                Participants
              </Label>
              <Input
                id="participants"
                placeholder="Number of participants"
                type="number"
                min="1"
                className="col-span-4"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Book Lab</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
