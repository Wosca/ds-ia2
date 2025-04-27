"use server";

import { db } from "@/db";
import { teams, teamMembers } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, not, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Interface for team creation/update
interface TeamFormData {
  name: string;
}

// Create a new team
export async function createTeam(formData: TeamFormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a team");
  }

  try {
    // First, create the team
    const result = await db
      .insert(teams)
      .values({
        name: formData.name,
        creatorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: teams.id });

    const teamId = result[0].id;

    // Then, add the creator as a member
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: teamId,
      joinedAt: new Date(),
    });

    // Revalidate the teams page
    revalidatePath("/dashboard/teams");
    return { success: true, teamId };
  } catch (error: unknown) {
    console.error("Error creating team:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        success: false,
        error:
          "A team with that name already exists. Please choose a different name.",
      };
    }
    return { success: false, error: "Failed to create team" };
  }
}

// Update an existing team
export async function updateTeam(teamId: number, formData: TeamFormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to update a team");
  }

  try {
    // Check if the team exists and user is the creator
    const existingTeam = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, teamId), eq(teams.creatorId, user.id)))
      .limit(1);

    if (existingTeam.length === 0) {
      return {
        success: false,
        error: "Team not found or you don't have permission to edit it",
      };
    }

    // Update the team
    await db
      .update(teams)
      .set({
        name: formData.name,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, teamId));

    // Revalidate the teams page
    revalidatePath("/dashboard/teams");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating team:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        success: false,
        error:
          "A team with that name already exists. Please choose a different name.",
      };
    }
    return { success: false, error: "Failed to update team" };
  }
}

// Delete a team
export async function deleteTeam(teamId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to delete a team");
  }

  try {
    // Check if the team exists and user is the creator
    const existingTeam = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, teamId), eq(teams.creatorId, user.id)))
      .limit(1);

    if (existingTeam.length === 0) {
      return {
        success: false,
        error: "Team not found or you don't have permission to delete it",
      };
    }

    // Delete the team (cascade will handle team members)
    await db.delete(teams).where(eq(teams.id, teamId));

    // Revalidate the teams page
    revalidatePath("/dashboard/teams");
    return { success: true };
  } catch (error) {
    console.error("Error deleting team:", error);
    return { success: false, error: "Failed to delete team" };
  }
}

// Leave a team (for non-creators)
export async function leaveTeam(teamId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to leave a team");
  }

  try {
    // Check if user is a member of the team and not the creator
    const isMember = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id))
      )
      .limit(1);

    // Check if user is the creator (creators can't leave, they must delete)
    const isCreator = await db
      .select()
      .from(teams)
      .where(and(eq(teams.id, teamId), eq(teams.creatorId, user.id)))
      .limit(1);

    if (isMember.length === 0) {
      return {
        success: false,
        error: "You are not a member of this team",
      };
    }

    if (isCreator.length > 0) {
      return {
        success: false,
        error:
          "As the team creator, you cannot leave the team. You can delete it instead.",
      };
    }

    // Remove user from team
    await db
      .delete(teamMembers)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id))
      );

    // Revalidate the teams page
    revalidatePath("/dashboard/teams");
    return { success: true };
  } catch (error) {
    console.error("Error leaving team:", error);
    return { success: false, error: "Failed to leave team" };
  }
}

// Get all teams for the current user
export async function getUserTeams() {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view teams");
  }

  try {
    const userTeams = await db
      .select({
        teamId: teams.id,
        teamName: teams.name,
        creatorId: teams.creatorId,
        createdAt: teams.createdAt,
        updatedAt: teams.updatedAt,
        joinedAt: teamMembers.joinedAt,
      })
      .from(teamMembers)
      .innerJoin(teams, eq(teamMembers.teamId, teams.id))
      .where(eq(teamMembers.userId, user.id));

    return userTeams;
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

// Get all available public teams (for joining)
export async function getAvailableTeams() {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view available teams");
  }

  try {
    // Get teams where the user is NOT a member
    const userMemberTeamIds = await db
      .select({ teamId: teamMembers.teamId })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user.id));

    const excludeTeamIds = userMemberTeamIds.map((t) => t.teamId);

    // Get all teams except those the user is already a member of
    let availableTeams;
    if (excludeTeamIds.length > 0) {
      availableTeams = await db
        .select({
          id: teams.id,
          name: teams.name,
          creatorId: teams.creatorId,
          createdAt: teams.createdAt,
        })
        .from(teams)
        .where(
          // Using not(in) since !in is not valid syntax
          not(inArray(teams.id, excludeTeamIds))
        );
    } else {
      // If user is not in any teams, get all teams
      availableTeams = await db
        .select({
          id: teams.id,
          name: teams.name,
          creatorId: teams.creatorId,
          createdAt: teams.createdAt,
        })
        .from(teams);
    }

    return availableTeams;
  } catch (error) {
    console.error("Error fetching available teams:", error);
    return [];
  }
}

// Join a team
export async function joinTeam(teamId: number) {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to join a team");
  }

  try {
    // Check if user is already a member
    const existingMembership = await db
      .select()
      .from(teamMembers)
      .where(
        and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, user.id))
      )
      .limit(1);

    if (existingMembership.length > 0) {
      return {
        success: false,
        error: "You are already a member of this team",
      };
    }

    // Add user to team
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: teamId,
      joinedAt: new Date(),
    });

    // Revalidate the teams page
    revalidatePath("/dashboard/teams");
    return { success: true };
  } catch (error) {
    console.error("Error joining team:", error);
    return { success: false, error: "Failed to join team" };
  }
}
