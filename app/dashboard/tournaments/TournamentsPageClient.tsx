"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/animated-tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Trophy,
  Calendar,
  Settings,
  PlusCircle,
  Gamepad2,
  Check,
  Trash2,
  Users,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { TournamentsDialog } from "./TournamentsDialog";
import {
  createTournament,
  updateTournament,
  deleteTournament,
  registerForTournament,
  unregisterFromTournament,
} from "@/lib/tournamentActions";
import { toast } from "sonner";

// Define the types for our props
interface TournamentsPageClientProps {
  userTournaments: {
    tournamentId: number;
    tournamentName: string;
    game: string;
    genre: string;
    date: Date;
    prizeFund: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    registeredAt: Date;
  }[];
  availableTournaments: {
    id: number;
    name: string;
    game: string;
    genre: string;
    date: Date;
    prizeFund: string;
    creatorId: string | null;
    createdAt: Date | null;
  }[];
  user: { id: string; firstName: string; lastName: string };
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

export default function TournamentsPageClient({
  userTournaments,
  availableTournaments,
  user,
}: TournamentsPageClientProps) {
  const router = useRouter();

  // Tournament dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<
    TournamentData | undefined
  >(undefined);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Alert dialog states
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<{
    type: "unregister" | "delete";
    tournamentId: number;
    tournamentName: string;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState<"name" | "game" | "genre">(
    "name"
  );

  // Handle successful tournament actions
  const handleActionComplete = () => {
    closeDialog();
    router.refresh();
  };

  // Open create tournament dialog
  const openCreateDialog = () => {
    setSelectedTournament(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Open edit tournament dialog
  const openEditDialog = (tournament: TournamentData) => {
    setSelectedTournament(tournament);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Close dialog and reset state
  const closeDialog = () => {
    setDialogOpen(false);
    // Reset state after dialog animation completes
    setTimeout(() => {
      setSelectedTournament(undefined);
    }, 300);
  };

  // Open alert dialog for tournament actions that need confirmation
  const openAlertDialog = (
    type: "unregister" | "delete",
    tournamentId: number,
    tournamentName: string
  ) => {
    setAlertAction({ type, tournamentId, tournamentName });
    setAlertDialogOpen(true);
  };

  // Handle register for tournament
  const handleRegisterForTournament = async (tournamentId: number) => {
    try {
      const result = await registerForTournament(tournamentId);
      if (result.success) {
        toast.success("You have successfully registered for the tournament");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to register for tournament");
      }
    } catch (error) {
      console.error("Error registering for tournament:", error);
      toast.error("An error occurred when registering for the tournament");
    }
  };

  // Handle unregister from tournament
  const handleUnregisterFromTournament = async (tournamentId: number) => {
    try {
      const result = await unregisterFromTournament(tournamentId);
      if (result.success) {
        toast.success("You have unregistered from the tournament");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to unregister from tournament");
      }
    } catch (error) {
      console.error("Error unregistering from tournament:", error);
      toast.error("An error occurred when unregistering from the tournament");
    }
  };

  // Handle delete tournament
  const handleDeleteTournament = async (tournamentId: number) => {
    try {
      const result = await deleteTournament(tournamentId);
      if (result.success) {
        toast.success("Tournament successfully deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete tournament");
      }
    } catch (error) {
      console.error("Error deleting tournament:", error);
      toast.error("An error occurred when deleting the tournament");
    }
  };

  // Execute the confirmed action
  const handleConfirmedAction = () => {
    if (!alertAction) return;

    if (alertAction.type === "unregister") {
      handleUnregisterFromTournament(alertAction.tournamentId);
    } else if (alertAction.type === "delete") {
      handleDeleteTournament(alertAction.tournamentId);
    }

    setAlertDialogOpen(false);
    setAlertAction(null);
  };

  // Filter available tournaments based on search
  const filteredTournaments = availableTournaments.filter((tournament) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    switch (searchFilter) {
      case "name":
        return tournament.name.toLowerCase().includes(searchLower);
      case "game":
        return tournament.game.toLowerCase().includes(searchLower);
      case "genre":
        return tournament.genre.toLowerCase().includes(searchLower);
      default:
        return tournament.name.toLowerCase().includes(searchLower);
    }
  });

  return (
    <div className="px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Esports Tournaments
          </h1>
          <p className="text-muted-foreground">
            Create or register for esports tournaments and compete with your
            team
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Tournament
        </Button>
      </div>

      <Tabs defaultValue="my-tournaments" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-tournaments">
            <Trophy className="h-4 w-4 mr-2" />
            My Tournaments
          </TabsTrigger>
          <TabsTrigger value="available-tournaments">
            <Gamepad2 className="h-4 w-4 mr-2" />
            Browse Tournaments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-tournaments" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userTournaments.length > 0 ? (
              userTournaments.map((tournament) => (
                <Card key={tournament.tournamentId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{tournament.tournamentName}</CardTitle>
                        <CardDescription>
                          {tournament.creatorId === user.id
                            ? "Tournament Organizer"
                            : "Registered Participant"}
                        </CardDescription>
                      </div>
                      <div className="bg-secondary p-2 rounded-full">
                        <Trophy className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Gamepad2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Game:{" "}
                          <span className="font-medium">{tournament.game}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Date:{" "}
                          <span className="font-medium">
                            {format(new Date(tournament.date), "MMMM d, yyyy")}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Genre:{" "}
                          <span className="font-medium">
                            {tournament.genre}
                          </span>
                        </p>
                      </div>
                      {tournament.prizeFund && (
                        <div className="flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-muted-foreground" />
                          <p className="text-sm">
                            Prize:{" "}
                            <span className="font-medium">
                              {tournament.prizeFund}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                    {tournament.creatorId === user.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEditDialog({
                              tournamentId: tournament.tournamentId,
                              name: tournament.tournamentName,
                              game: tournament.game,
                              genre: tournament.genre,
                              date: tournament.date,
                              prizeFund: tournament.prizeFund,
                              isCreator: true,
                            })
                          }
                        >
                          <Settings className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            openAlertDialog(
                              "delete",
                              tournament.tournamentId,
                              tournament.tournamentName
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openAlertDialog(
                            "unregister",
                            tournament.tournamentId,
                            tournament.tournamentName
                          )
                        }
                      >
                        <Users className="h-4 w-4 mr-2" /> Unregister
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-lg border border-dashed space-y-2 text-center text-muted-foreground">
                <Trophy className="h-10 w-10 mb-2 text-muted-foreground/70" />
                <h3 className="font-medium">No Tournaments Found</h3>
                <p className="text-sm">
                  You have not created or registered for any tournaments yet
                </p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Tournament
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available-tournaments">
          <Card>
            <CardHeader>
              <CardTitle>Browse Tournaments</CardTitle>
              <CardDescription>
                Search and register for upcoming esports tournaments
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search tournaments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={searchFilter === "name" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchFilter("name")}
                  >
                    <Search className="h-4 w-4 mr-2" /> Name
                  </Button>
                  <Button
                    variant={searchFilter === "game" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchFilter("game")}
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" /> Game
                  </Button>
                  <Button
                    variant={searchFilter === "genre" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchFilter("genre")}
                  >
                    <Users className="h-4 w-4 mr-2" /> Genre
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {filteredTournaments.length > 0 ? (
                    filteredTournaments.map((tournament) => (
                      <div
                        key={tournament.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center mb-2 sm:mb-0">
                          <div className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                            <Trophy className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{tournament.name}</p>
                            <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Gamepad2 className="h-3 w-3 mr-1" />{" "}
                                {tournament.game}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />{" "}
                                {format(
                                  new Date(tournament.date),
                                  "MMM d, yyyy"
                                )}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />{" "}
                                {tournament.genre}
                              </span>
                              {tournament.prizeFund && (
                                <span className="flex items-center">
                                  <Trophy className="h-3 w-3 mr-1" />{" "}
                                  {tournament.prizeFund}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleRegisterForTournament(tournament.id)
                            }
                          >
                            <Users className="mr-2 h-4 w-4" /> Register
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <Check className="h-10 w-10 mb-2 text-muted-foreground/70" />
                      <h3 className="font-medium">
                        {searchTerm
                          ? "No Tournaments Found"
                          : "You've Registered for All Tournaments"}
                      </h3>
                      <p className="text-sm mt-1">
                        {searchTerm
                          ? `No tournaments match your search for "${searchTerm}"`
                          : "There are no more tournaments available to register for"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TournamentsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        tournament={selectedTournament}
        mode={dialogMode}
        onComplete={handleActionComplete}
        createTournament={createTournament}
        updateTournament={updateTournament}
      />

      {/* Alert Dialog for confirmations */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction?.type === "delete"
                ? "Delete Tournament"
                : "Unregister from Tournament"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction?.type === "delete"
                ? `Are you sure you want to delete "${alertAction.tournamentName}"? This action cannot be undone.`
                : `Are you sure you want to unregister from "${alertAction?.tournamentName}"? You will need to register again if you want to participate.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedAction}
              className={
                alertAction?.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {alertAction?.type === "delete" ? "Delete" : "Unregister"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
