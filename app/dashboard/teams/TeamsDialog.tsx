"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

// This is the interface for our form data
interface TeamFormData {
  name: string;
}

// Type for team data
type TeamData = {
  teamId: number;
  name: string;
  isCreator: boolean;
};

// This is the interface for our component props
interface TeamsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  team?: TeamData;
  mode: "create" | "edit";
  onComplete?: () => void;
  createTeam?: (data: {
    name: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateTeam?: (
    teamId: number,
    data: { name: string }
  ) => Promise<{ success: boolean; error?: string }>;
}

export function TeamsDialog({
  open,
  onOpenChange,
  team,
  mode,
  onComplete,
  createTeam,
  updateTeam,
}: TeamsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeamFormData>({
    name: team?.name || "",
  });
  const isEditMode = mode === "edit";

  // Reset form when team changes
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
      });
    } else {
      setFormData({
        name: "",
      });
    }
  }, [team]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a team name");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isEditMode && team && updateTeam) {
        result = await updateTeam(team.teamId, formData);
      } else if (createTeam) {
        result = await createTeam(formData);
      } else {
        throw new Error("Missing required action functions");
      }

      if (!result.success) {
        throw new Error(
          result.error || `Failed to ${isEditMode ? "update" : "create"} team`
        );
      }

      // Show success toast
      toast.success(
        isEditMode ? "Team updated successfully" : "Team created successfully"
      );

      // Notify parent of completion
      if (onComplete) onComplete();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} team:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditMode ? "update" : "create"
            } team. Please try again.`
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
            {isEditMode ? "Edit Team" : "Create New Team"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update your team details below."
              : "Create a new esports team to compete in tournaments."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Team Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter team name"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? "Update Team" : "Create Team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
