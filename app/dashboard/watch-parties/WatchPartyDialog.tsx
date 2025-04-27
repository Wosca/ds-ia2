"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { LoadingButton } from "@/components/ui/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@/components/ui/date-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This is the interface for our form data
interface WatchPartyFormData {
  tournamentId: number;
  date: Date;
  time: string;
  location: string;
  maxAttendees: string;
}

// Type for watch party data
type WatchPartyData = {
  watchPartyId: number;
  tournamentId: number;
  tournamentName: string;
  game: string;
  date: Date;
  time: string;
  location: string;
  maxAttendees: string;
  attendeeCount: number;
  isCreator: boolean;
};

// Type for tournament data used in select
type TournamentSelectOption = {
  id: number;
  name: string;
};

// This is the interface for our component props
interface WatchPartyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  watchParty?: WatchPartyData;
  mode: "create" | "edit";
  onComplete?: () => void;
  availableTournaments: TournamentSelectOption[];
  createWatchParty?: (data: {
    tournamentId: number;
    date: Date;
    time: string;
    location: string;
    maxAttendees: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateWatchParty?: (
    watchPartyId: number,
    data: {
      tournamentId: number;
      date: Date;
      time: string;
      location: string;
      maxAttendees: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
}

export function WatchPartyDialog({
  open,
  onOpenChange,
  watchParty,
  mode,
  onComplete,
  availableTournaments,
  createWatchParty,
  updateWatchParty,
}: WatchPartyDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<WatchPartyFormData>({
    tournamentId: watchParty?.tournamentId || 0,
    date: watchParty?.date || new Date(),
    time: watchParty?.time || "18:00",
    location: watchParty?.location || "",
    maxAttendees: watchParty?.maxAttendees || "20",
  });
  const isEditMode = mode === "edit";

  // Reset form when watch party changes
  useEffect(() => {
    if (watchParty) {
      setFormData({
        tournamentId: watchParty.tournamentId,
        date: watchParty.date,
        time: watchParty.time,
        location: watchParty.location,
        maxAttendees: watchParty.maxAttendees,
      });
    } else {
      setFormData({
        tournamentId: availableTournaments[0]?.id || 0,
        date: new Date(),
        time: "18:00",
        location: "",
        maxAttendees: "20",
      });
    }
  }, [watchParty, availableTournaments]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.tournamentId) {
      toast.error("Please select a tournament");
      return;
    }

    if (!formData.location) {
      toast.error("Please enter a location");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isEditMode && watchParty && updateWatchParty) {
        result = await updateWatchParty(watchParty.watchPartyId, formData);
      } else if (createWatchParty) {
        result = await createWatchParty(formData);
      } else {
        throw new Error("Missing required action functions");
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            `Failed to ${isEditMode ? "update" : "create"} watch party`
        );
      }

      // Show success toast
      toast.success(
        isEditMode
          ? "Watch party updated successfully"
          : "Watch party created successfully"
      );

      // Notify parent of completion
      if (onComplete) onComplete();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} watch party:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditMode ? "update" : "create"
            } watch party. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        // Prevent closing the dialog if loading
        if (loading && !isOpen) return;
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Watch Party" : "Create New Watch Party"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update watch party details below."
              : "Create a new watch party for an esports tournament."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tournament" className="text-right">
              Tournament
            </Label>
            <Select
              value={formData.tournamentId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, tournamentId: parseInt(value) })
              }
              disabled={loading || isEditMode}
            >
              <SelectTrigger id="tournament" className="col-span-3">
                <SelectValue placeholder="Select tournament" />
              </SelectTrigger>
              <SelectContent>
                {availableTournaments.map((tournament) => (
                  <SelectItem
                    key={tournament.id}
                    value={tournament.id.toString()}
                  >
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <div className="col-span-3">
              <DateInput
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date })}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="col-span-3"
              placeholder="e.g., Computer Lab A, Room 102"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxAttendees" className="text-right">
              Max Attendees
            </Label>
            <Input
              id="maxAttendees"
              type="number"
              min="1"
              value={formData.maxAttendees}
              onChange={(e) =>
                setFormData({ ...formData, maxAttendees: e.target.value })
              }
              className="col-span-3"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <LoadingButton onClick={handleSubmit} loading={loading}>
            {isEditMode ? "Update Watch Party" : "Create Watch Party"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
