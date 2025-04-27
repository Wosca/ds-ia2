"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
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
  MapPin,
  Eye,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { WatchPartyDialog } from "./WatchPartyDialog";
import {
  createWatchParty,
  updateWatchParty,
  deleteWatchParty,
  joinWatchParty,
  leaveWatchParty,
} from "@/lib/watchPartyActions";
import { toast } from "sonner";

// Define the types for our props
interface WatchPartiesPageClientProps {
  userWatchParties: {
    watchPartyId: number;
    tournamentId: number;
    tournamentName: string;
    game: string;
    date: Date;
    time: string;
    location: string;
    maxAttendees: string | number;
    attendeeCount: number;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    joinedAt: Date;
  }[];
  availableWatchParties: {
    id: number;
    tournamentId: number;
    tournamentName: string;
    game: string;
    date: Date;
    time: string;
    location: string;
    maxAttendees: string | number;
    attendeeCount: number;
    creatorId: string;
    createdAt: Date;
  }[];
  tournamentOptions: {
    id: number;
    name: string;
  }[];
  user: { id: string; firstName: string; lastName: string };
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

export default function WatchPartiesPageClient({
  userWatchParties,
  availableWatchParties,
  tournamentOptions,
  user,
}: WatchPartiesPageClientProps) {
  const router = useRouter();

  // Watch party dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedWatchParty, setSelectedWatchParty] = useState<
    WatchPartyData | undefined
  >(undefined);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Alert dialog states
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<{
    type: "leave" | "delete";
    watchPartyId: number;
    watchPartyName: string;
  } | null>(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFilter, setSearchFilter] = useState<
    "tournament" | "location" | "date"
  >("tournament");

  // Loading states
  const [joinLoading, setJoinLoading] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Handle successful watch party actions
  const handleActionComplete = () => {
    closeDialog();
    router.refresh();
  };

  // Open create watch party dialog
  const openCreateDialog = () => {
    setSelectedWatchParty(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Open edit watch party dialog
  const openEditDialog = (watchParty: WatchPartyData) => {
    setSelectedWatchParty(watchParty);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Close dialog and reset state
  const closeDialog = () => {
    setDialogOpen(false);
    // Reset state after dialog animation completes
    setTimeout(() => {
      setSelectedWatchParty(undefined);
    }, 300);
  };

  // Open alert dialog for watch party actions that need confirmation
  const openAlertDialog = (
    type: "leave" | "delete",
    watchPartyId: number,
    watchPartyName: string
  ) => {
    setAlertAction({ type, watchPartyId, watchPartyName });
    setAlertDialogOpen(true);
  };

  // Handle joining a watch party
  const handleJoinWatchParty = async (watchPartyId: number) => {
    try {
      setJoinLoading(watchPartyId);
      const result = await joinWatchParty(watchPartyId);
      if (result.success) {
        toast.success("You have successfully joined the watch party");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to join watch party");
      }
    } catch (error) {
      console.error("Error joining watch party:", error);
      toast.error("An error occurred when joining the watch party");
    } finally {
      setJoinLoading(null);
    }
  };

  // Handle leaving a watch party
  const handleLeaveWatchParty = async (watchPartyId: number) => {
    try {
      setActionLoading(true);
      const result = await leaveWatchParty(watchPartyId);
      if (result.success) {
        toast.success("You have left the watch party");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to leave watch party");
      }
    } catch (error) {
      console.error("Error leaving watch party:", error);
      toast.error("An error occurred when leaving the watch party");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete watch party
  const handleDeleteWatchParty = async (watchPartyId: number) => {
    try {
      setActionLoading(true);
      const result = await deleteWatchParty(watchPartyId);
      if (result.success) {
        toast.success("Watch party successfully deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete watch party");
      }
    } catch (error) {
      console.error("Error deleting watch party:", error);
      toast.error("An error occurred when deleting the watch party");
    } finally {
      setActionLoading(false);
    }
  };

  // Execute the confirmed action
  const handleConfirmedAction = () => {
    if (!alertAction) return;

    if (alertAction.type === "leave") {
      handleLeaveWatchParty(alertAction.watchPartyId);
    } else if (alertAction.type === "delete") {
      handleDeleteWatchParty(alertAction.watchPartyId);
    }

    setAlertDialogOpen(false);
    setAlertAction(null);
  };

  // Filter available watch parties based on search
  const filteredWatchParties = availableWatchParties.filter((party) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    switch (searchFilter) {
      case "tournament":
        return party.tournamentName.toLowerCase().includes(searchLower);
      case "location":
        return party.location.toLowerCase().includes(searchLower);
      case "date":
        const dateString = format(new Date(party.date), "MMMM d, yyyy");
        return dateString.toLowerCase().includes(searchLower);
      default:
        return party.tournamentName.toLowerCase().includes(searchLower);
    }
  });

  return (
    <div className="px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Watch Parties</h1>
          <p className="text-muted-foreground">
            Create or join watch parties for esports tournaments
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Watch Party
        </Button>
      </div>

      <Tabs defaultValue="my-parties" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-parties">
            <Eye className="h-4 w-4 mr-2" />
            My Watch Parties
          </TabsTrigger>
          <TabsTrigger value="available-parties">
            <Users className="h-4 w-4 mr-2" />
            Browse Watch Parties
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-parties" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userWatchParties.length > 0 ? (
              userWatchParties.map((party) => (
                <Card key={party.watchPartyId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{party.tournamentName}</CardTitle>
                        <CardDescription>
                          {party.creatorId === user.id
                            ? "Party Organizer"
                            : "Party Attendee"}
                        </CardDescription>
                      </div>
                      <div className="bg-secondary p-2 rounded-full">
                        <Eye className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Gamepad2 className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Game:{" "}
                          <span className="font-medium">{party.game}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Date:{" "}
                          <span className="font-medium">
                            {format(new Date(party.date), "MMMM d, yyyy")}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Time:{" "}
                          <span className="font-medium">{party.time}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Location:{" "}
                          <span className="font-medium">{party.location}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Attendees:{" "}
                          <span className="font-medium">
                            {party.attendeeCount} / {party.maxAttendees}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                    {party.creatorId === user.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEditDialog({
                              watchPartyId: party.watchPartyId,
                              tournamentId: party.tournamentId,
                              tournamentName: party.tournamentName,
                              game: party.game,
                              date: party.date,
                              time: party.time,
                              location: party.location,
                              maxAttendees: party.maxAttendees.toString(),
                              attendeeCount: party.attendeeCount,
                              isCreator: true,
                            })
                          }
                        >
                          <Settings className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <LoadingButton
                          variant="destructive"
                          size="sm"
                          loading={actionLoading}
                          onClick={() =>
                            openAlertDialog(
                              "delete",
                              party.watchPartyId,
                              party.tournamentName
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </LoadingButton>
                      </>
                    ) : (
                      <LoadingButton
                        variant="outline"
                        size="sm"
                        loading={actionLoading}
                        onClick={() =>
                          openAlertDialog(
                            "leave",
                            party.watchPartyId,
                            party.tournamentName
                          )
                        }
                      >
                        <Users className="h-4 w-4 mr-2" /> Leave
                      </LoadingButton>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-lg border border-dashed space-y-2 text-center text-muted-foreground">
                <Eye className="h-10 w-10 mb-2 text-muted-foreground/70" />
                <h3 className="font-medium">No Watch Parties Found</h3>
                <p className="text-sm">
                  You haven&apos;t created or joined any watch parties yet
                </p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Watch Party
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available-parties">
          <Card>
            <CardHeader>
              <CardTitle>Browse Watch Parties</CardTitle>
              <CardDescription>
                Search and join watch parties for upcoming esports tournaments
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search watch parties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={
                      searchFilter === "tournament" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSearchFilter("tournament")}
                  >
                    <Trophy className="h-4 w-4 mr-2" /> Tournament
                  </Button>
                  <Button
                    variant={
                      searchFilter === "location" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSearchFilter("location")}
                  >
                    <MapPin className="h-4 w-4 mr-2" /> Location
                  </Button>
                  <Button
                    variant={searchFilter === "date" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSearchFilter("date")}
                  >
                    <Calendar className="h-4 w-4 mr-2" /> Date
                  </Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {filteredWatchParties.length > 0 ? (
                    filteredWatchParties.map((party) => (
                      <div
                        key={party.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start sm:items-center mb-2 sm:mb-0">
                          <div className="bg-secondary h-10 w-10 rounded-full flex items-center justify-center mr-3">
                            <Eye className="h-5 w-5 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {party.tournamentName}
                            </p>
                            <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                              <span className="flex items-center">
                                <Gamepad2 className="h-3 w-3 mr-1" />{" "}
                                {party.game}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />{" "}
                                {format(new Date(party.date), "MMM d, yyyy")}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" /> {party.time}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />{" "}
                                {party.location}
                              </span>
                              <span className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />{" "}
                                {party.attendeeCount} / {party.maxAttendees}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <LoadingButton
                            size="sm"
                            disabled={
                              Number(party.attendeeCount) >=
                              Number(party.maxAttendees)
                            }
                            loading={joinLoading === party.id}
                            onClick={() => handleJoinWatchParty(party.id)}
                          >
                            <Users className="mr-2 h-4 w-4" />
                            {Number(party.attendeeCount) >=
                            Number(party.maxAttendees)
                              ? "Full"
                              : "Join"}
                          </LoadingButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <Check className="h-10 w-10 mb-2 text-muted-foreground/70" />
                      <h3 className="font-medium">
                        {searchTerm
                          ? "No Watch Parties Found"
                          : "You've Joined All Watch Parties"}
                      </h3>
                      <p className="text-sm mt-1">
                        {searchTerm
                          ? `No watch parties match your search for "${searchTerm}"`
                          : "There are no more watch parties available to join"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <WatchPartyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        watchParty={selectedWatchParty}
        mode={dialogMode}
        onComplete={handleActionComplete}
        availableTournaments={tournamentOptions}
        createWatchParty={createWatchParty}
        updateWatchParty={updateWatchParty}
      />

      {/* Alert Dialog for confirmations */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction?.type === "delete"
                ? "Delete Watch Party"
                : "Leave Watch Party"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction?.type === "delete"
                ? `Are you sure you want to delete the watch party for "${alertAction.watchPartyName}"? This action cannot be undone.`
                : `Are you sure you want to leave the watch party for "${alertAction?.watchPartyName}"? You will need to rejoin if you want to attend.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>
              Cancel
            </AlertDialogCancel>
            <LoadingButton
              loading={actionLoading}
              onClick={handleConfirmedAction}
              className={
                alertAction?.type === "delete"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {alertAction?.type === "delete" ? "Delete" : "Leave"}
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
