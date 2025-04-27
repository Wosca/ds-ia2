"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// This is the interface for our form data
interface BookingFormData {
  labId: number;
  teamId: number;
  bookingDate: Date;
}

// Interface for edit mode booking
interface BookingData {
  bookingId: number;
  labId: number;
  teamId: number;
  bookingDate: Date;
  labName: string;
  teamName: string;
}

// This is the interface for our component props
interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking?: BookingData;
  labs: { id: number; name: string; computerCount: number }[];
  initialLabId?: number;
  onComplete?: () => void;
  createBooking?: (data: {
    labId: number;
    teamId: number;
    bookingDate: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateBooking?: (
    bookingId: number,
    data: { labId: number; teamId: number; bookingDate: string }
  ) => Promise<{ success: boolean; error?: string }>;
  deleteBooking?: (
    bookingId: number
  ) => Promise<{ success: boolean; error?: string }>;
  getClientUserTeams: () => Promise<{ teamId: number; teamName: string }[]>;
}

export function BookingDialog({
  open,
  onOpenChange,
  booking,
  labs,
  initialLabId,
  onComplete,
  createBooking,
  updateBooking,
  deleteBooking,
  getClientUserTeams,
}: BookingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    booking ? new Date(booking.bookingDate) : undefined
  );
  const [teams, setTeams] = useState<{ teamId: number; teamName: string }[]>(
    []
  );
  const [formData, setFormData] = useState<BookingFormData>({
    labId: booking?.labId || initialLabId || 0,
    teamId: booking?.teamId || 0,
    bookingDate: booking?.bookingDate || new Date(),
  });
  const [timeInput, setTimeInput] = useState<string>(
    booking ? format(new Date(booking.bookingDate), "HH:mm") : ""
  );
  const isEditMode = !!booking;

  // Reset form when booking or initialLabId changes
  useEffect(() => {
    if (booking) {
      setDate(new Date(booking.bookingDate));
      setTimeInput(format(new Date(booking.bookingDate), "HH:mm"));
      setFormData({
        labId: booking.labId,
        teamId: booking.teamId,
        bookingDate: booking.bookingDate,
      });
    } else {
      setDate(undefined);
      setTimeInput("");
      setFormData({
        labId: initialLabId || (labs.length > 0 ? labs[0].id : 0),
        teamId: 0,
        bookingDate: new Date(),
      });
    }
  }, [booking, initialLabId, labs]);

  // Fetch teams data when dialog opens
  useEffect(() => {
    async function fetchTeams() {
      try {
        // Use the server action passed as prop instead of importing directly
        const teamsData = await getClientUserTeams();
        setTeams(teamsData);

        // Set default team if we have teams and no booking is being edited
        if (teamsData.length > 0 && !isEditMode) {
          setFormData((prev) => ({
            ...prev,
            teamId: teamsData[0].teamId,
          }));
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }

    if (open) {
      fetchTeams();
    }
  }, [open, isEditMode, getClientUserTeams]);

  // Update formData when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      setFormData((prev) => ({
        ...prev,
        bookingDate: newDate,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!date || !formData.labId || !formData.teamId || !timeInput) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const [hours, minutes] = timeInput.split(":").map(Number);
      const bookingDateTime = new Date(date);
      bookingDateTime.setHours(hours, minutes);

      const bookingData = {
        labId: formData.labId,
        teamId: formData.teamId,
        bookingDate: bookingDateTime.toISOString(),
      };

      let result;

      if (isEditMode && booking && updateBooking) {
        result = await updateBooking(booking.bookingId, bookingData);
      } else if (createBooking) {
        result = await createBooking(bookingData);
      } else {
        throw new Error("Missing required action functions");
      }

      if (!result.success) {
        throw new Error(result.error || "Failed to save booking");
      }

      // Notify parent of completion
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete booking
  const handleDelete = async () => {
    if (!isEditMode || !booking || !deleteBooking) return;

    if (!confirm("Are you sure you want to delete this booking?")) {
      return;
    }

    setLoading(true);

    try {
      const result = await deleteBooking(booking.bookingId);

      if (!result.success) {
        throw new Error(result.error || "Failed to delete booking");
      }

      // Notify parent of completion
      if (onComplete) onComplete();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete booking. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Booking" : "Create New Booking"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your lab booking details below."
              : "Book a computer lab for your team practice or competition."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lab" className="text-right">
              Lab
            </Label>
            <Select
              value={formData.labId ? formData.labId.toString() : ""}
              onValueChange={(value) =>
                setFormData({ ...formData, labId: parseInt(value) })
              }
              disabled={loading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a lab" />
              </SelectTrigger>
              <SelectContent>
                {labs.map((lab) => (
                  <SelectItem key={lab.id} value={lab.id.toString()}>
                    {lab.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">
              Team
            </Label>
            <Select
              value={formData.teamId ? formData.teamId.toString() : ""}
              onValueChange={(value) =>
                setFormData({ ...formData, teamId: parseInt(value) })
              }
              disabled={loading}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.teamId} value={team.teamId.toString()}>
                    {team.teamName}
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
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={loading}
                    onClick={() => console.log("Date button clicked")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter className={isEditMode ? "justify-between" : ""}>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete Booking
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? "Update Booking" : "Create Booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
