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
  Users,
  UserPlus,
  Calendar,
  Settings,
  PlusCircle,
  LogIn,
  Check,
  Trophy,
  UserMinus,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TeamsDialog } from "./TeamsDialog";
import {
  createTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
} from "@/lib/teamActions";
import { toast } from "sonner";

// Define the types for our props
interface TeamsPageClientProps {
  userTeams: {
    teamId: number;
    teamName: string;
    creatorId: string;
    createdAt: Date;
    updatedAt: Date;
    joinedAt: Date;
  }[];
  availableTeams: {
    id: number;
    name: string;
    creatorId: string;
    createdAt: Date;
  }[];
  user: { id: string; firstName: string; lastName: string };
}

// Type for team data
type TeamData = {
  teamId: number;
  name: string;
  isCreator: boolean;
};

export default function TeamsPageClient({
  userTeams,
  availableTeams,
  user,
}: TeamsPageClientProps) {
  const router = useRouter();

  // Team dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamData | undefined>(
    undefined
  );
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");

  // Alert dialog states
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<{
    type: "leave" | "delete";
    teamId: number;
    teamName: string;
  } | null>(null);

  // Handle successful team actions
  const handleActionComplete = () => {
    closeDialog();
    router.refresh();
  };

  // Open create team dialog
  const openCreateDialog = () => {
    setSelectedTeam(undefined);
    setDialogMode("create");
    setDialogOpen(true);
  };

  // Open edit team dialog
  const openEditDialog = (team: TeamData) => {
    setSelectedTeam(team);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Close dialog and reset state
  const closeDialog = () => {
    setDialogOpen(false);
    // Reset state after dialog animation completes
    setTimeout(() => {
      setSelectedTeam(undefined);
    }, 300);
  };

  // Open alert dialog for team actions that need confirmation
  const openAlertDialog = (
    type: "leave" | "delete",
    teamId: number,
    teamName: string
  ) => {
    setAlertAction({ type, teamId, teamName });
    setAlertDialogOpen(true);
  };

  // Handle join team
  const handleJoinTeam = async (teamId: number) => {
    try {
      const result = await joinTeam(teamId);
      if (result.success) {
        toast.success("You have successfully joined the team");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to join team");
      }
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("An error occurred when joining the team");
    }
  };

  // Handle leave team
  const handleLeaveTeam = async (teamId: number) => {
    try {
      const result = await leaveTeam(teamId);
      if (result.success) {
        toast.success("You have left the team");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to leave team");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("An error occurred when leaving the team");
    }
  };

  // Handle delete team
  const handleDeleteTeam = async (teamId: number) => {
    try {
      const result = await deleteTeam(teamId);
      if (result.success) {
        toast.success("Team successfully deleted");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("An error occurred when deleting the team");
    }
  };

  // Execute the confirmed action
  const handleConfirmedAction = () => {
    if (!alertAction) return;

    if (alertAction.type === "leave") {
      handleLeaveTeam(alertAction.teamId);
    } else if (alertAction.type === "delete") {
      handleDeleteTeam(alertAction.teamId);
    }

    setAlertDialogOpen(false);
    setAlertAction(null);
  };

  return (
    <div className="px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Esports Teams</h1>
          <p className="text-muted-foreground">
            Create or join esports teams to compete in tournaments and events
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Team
        </Button>
      </div>

      <Tabs defaultValue="my-teams" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-teams">
            <Users className="h-4 w-4 mr-2" />
            My Teams
          </TabsTrigger>
          <TabsTrigger value="available-teams">
            <UserPlus className="h-4 w-4 mr-2" />
            Join Teams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-teams" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userTeams.length > 0 ? (
              userTeams.map((team) => (
                <Card key={team.teamId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{team.teamName}</CardTitle>
                        <CardDescription>
                          {team.creatorId === user.id
                            ? "Team Creator"
                            : "Team Member"}
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
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Joined:{" "}
                          <span className="font-medium">
                            {format(new Date(team.joinedAt), "MMMM d, yyyy")}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Status:{" "}
                          <span className="font-medium">
                            {team.creatorId === user.id ? "Creator" : "Member"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end space-x-2">
                    {team.creatorId === user.id ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEditDialog({
                              teamId: team.teamId,
                              name: team.teamName,
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
                              team.teamId,
                              team.teamName
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
                          openAlertDialog("leave", team.teamId, team.teamName)
                        }
                      >
                        <UserMinus className="h-4 w-4 mr-2" /> Leave
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-lg border border-dashed space-y-2 text-center text-muted-foreground">
                <Users className="h-10 w-10 mb-2 text-muted-foreground/70" />
                <h3 className="font-medium">No Teams Found</h3>
                <p className="text-sm">You are not a member of any teams yet</p>
                <Button onClick={openCreateDialog}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create New Team
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available-teams">
          <Card>
            <CardHeader>
              <CardTitle>Available Teams</CardTitle>
              <CardDescription>
                Browse and join existing esports teams
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {availableTeams.length > 0 ? (
                    availableTeams.map((team) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="bg-secondary h-8 w-8 rounded-full flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{team.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Created{" "}
                              {format(new Date(team.createdAt), "MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => handleJoinTeam(team.id)}>
                          <LogIn className="mr-2 h-4 w-4" /> Join Team
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                      <Check className="h-10 w-10 mb-2 text-muted-foreground/70" />
                      <h3 className="font-medium">
                        You&apos;ve Joined All Teams
                      </h3>
                      <p className="text-sm mt-1">
                        There are no more teams available to join
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TeamsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        team={selectedTeam}
        mode={dialogMode}
        onComplete={handleActionComplete}
        createTeam={createTeam}
        updateTeam={updateTeam}
      />

      {/* Alert Dialog for confirmations */}
      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction?.type === "delete" ? "Delete Team" : "Leave Team"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction?.type === "delete"
                ? `Are you sure you want to delete ${alertAction.teamName}? This action cannot be undone.`
                : `Are you sure you want to leave ${alertAction?.teamName}? You will need to rejoin if you want to be part of this team again.`}
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
              {alertAction?.type === "delete" ? "Delete" : "Leave"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
