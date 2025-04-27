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
import { DateInput } from "@/components/ui/date-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This is the interface for our form data
interface TournamentFormData {
  name: string;
  game: string;
  genre: string;
  date: Date;
  prizeFund: string;
}

// Type for tournament data
type TournamentData = {
  tournamentId: number;
  name: string;
  game: string;
  genre: string;
  date: Date;
  prizeFund: string;
  isCreator: boolean;
};

// Game genres
const GAME_GENRES = [
  "FPS",
  "MOBA",
  "Battle Royale",
  "Strategy",
  "Fighting",
  "Sports",
  "Racing",
  "Card Game",
];

// Popular games
const POPULAR_GAMES = [
  "Counter-Strike 2",
  "Valorant",
  "League of Legends",
  "Dota 2",
  "PUBG",
  "Fortnite",
  "Overwatch 2",
  "Rocket League",
  "FIFA 23",
  "Apex Legends",
];

// This is the interface for our component props
interface TournamentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tournament?: TournamentData;
  mode: "create" | "edit";
  onComplete?: () => void;
  createTournament?: (data: {
    name: string;
    game: string;
    genre: string;
    date: Date;
    prizeFund: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateTournament?: (
    tournamentId: number,
    data: {
      name: string;
      game: string;
      genre: string;
      date: Date;
      prizeFund: string;
    }
  ) => Promise<{ success: boolean; error?: string }>;
}

export function TournamentsDialog({
  open,
  onOpenChange,
  tournament,
  mode,
  onComplete,
  createTournament,
  updateTournament,
}: TournamentsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: tournament?.name || "",
    game: tournament?.game || "",
    genre: tournament?.genre || "",
    date: tournament?.date || new Date(),
    prizeFund: tournament?.prizeFund || "",
  });
  const isEditMode = mode === "edit";

  // Reset form when tournament changes
  useEffect(() => {
    if (tournament) {
      setFormData({
        name: tournament.name,
        game: tournament.game,
        genre: tournament.genre,
        date: tournament.date,
        prizeFund: tournament.prizeFund,
      });
    } else {
      setFormData({
        name: "",
        game: "",
        genre: "",
        date: new Date(),
        prizeFund: "",
      });
    }
  }, [tournament]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Please enter a tournament name");
      return;
    }

    if (!formData.game) {
      toast.error("Please select a game");
      return;
    }

    if (!formData.genre) {
      toast.error("Please select a genre");
      return;
    }

    setLoading(true);

    try {
      let result;

      if (isEditMode && tournament && updateTournament) {
        result = await updateTournament(tournament.tournamentId, formData);
      } else if (createTournament) {
        result = await createTournament(formData);
      } else {
        throw new Error("Missing required action functions");
      }

      if (!result.success) {
        throw new Error(
          result.error ||
            `Failed to ${isEditMode ? "update" : "create"} tournament`
        );
      }

      // Show success toast
      toast.success(
        isEditMode
          ? "Tournament updated successfully"
          : "Tournament created successfully"
      );

      // Notify parent of completion
      if (onComplete) onComplete();
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} tournament:`,
        error
      );
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${
              isEditMode ? "update" : "create"
            } tournament. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Tournament" : "Create New Tournament"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update tournament details below."
              : "Create a new esports tournament for teams to compete in."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Tournament Name
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter tournament name"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="game" className="text-right">
              Game
            </Label>
            <Select
              value={formData.game}
              onValueChange={(value) =>
                setFormData({ ...formData, game: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="game" className="col-span-3">
                <SelectValue placeholder="Select game" />
              </SelectTrigger>
              <SelectContent>
                {POPULAR_GAMES.map((game) => (
                  <SelectItem key={game} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Genre
            </Label>
            <Select
              value={formData.genre}
              onValueChange={(value) =>
                setFormData({ ...formData, genre: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="genre" className="col-span-3">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {GAME_GENRES.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
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
            <Label htmlFor="prizeFund" className="text-right">
              Prize Fund
            </Label>
            <Input
              id="prizeFund"
              value={formData.prizeFund}
              onChange={(e) =>
                setFormData({ ...formData, prizeFund: e.target.value })
              }
              className="col-span-3"
              placeholder="Enter prize fund (e.g., $1,000)"
              disabled={loading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? "Update Tournament" : "Create Tournament"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
