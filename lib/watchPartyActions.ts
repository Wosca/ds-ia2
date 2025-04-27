"use server";

import { db } from "@/db";
import { watchParties, watchPartyAttendees, tournaments } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, not, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Interface for watch party creation/update
interface WatchPartyFormData {
  tournamentId: number;
  date: Date;
  time: string;
  location: string;
  maxAttendees: string;
}

// Create a new watch party
export async function createWatchParty(formData: WatchPartyFormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a watch party");
  }

  try {
    // Combine date and time to create a datetime
    const partyDateTime = new Date(formData.date);
    const [hours, minutes] = formData.time.split(":").map(Number);
    partyDateTime.setHours(hours, minutes);
    // Create the watch party
    const result = await db
      .insert(watchParties)
      .values({
        tournamentId: formData.tournamentId,
        creatorId: user.id,
        partyDateTime: new Date(partyDateTime),
        location: formData.location,
        maxAttendees: parseInt(formData.maxAttendees),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: watchParties.id });

    const watchPartyId = result[0].id;

    // Register the creator as an attendee
    await db.insert(watchPartyAttendees).values({
      userId: user.id,
      watchPartyId,
      joinedAt: new Date(),
    });

    // Revalidate the watch parties page
    revalidatePath("/dashboard/watch-parties");
    return { success: true, watchPartyId };
  } catch (error: unknown) {
    console.error("Error creating watch party:", error);
    return { success: false, error: "Failed to create watch party" };
  }
}

// Update an existing watch party
export async function updateWatchParty(
  watchPartyId: number,
  formData: WatchPartyFormData
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to update a watch party");
  }

  try {
    // Check if the watch party exists and user is the creator
    const existingWatchParty = await db
      .select()
      .from(watchParties)
      .where(
        and(
          eq(watchParties.id, watchPartyId),
          eq(watchParties.creatorId, user.id)
        )
      )
      .limit(1);

    if (existingWatchParty.length === 0) {
      return {
        success: false,
        error: "Watch party not found or you don't have permission to edit it",
      };
    }

    // Combine date and time to create a datetime
    const partyDateTime = new Date(formData.date);
    const [hours, minutes] = formData.time.split(":").map(Number);
    partyDateTime.setHours(hours, minutes);

    // Update the watch party
    await db
      .update(watchParties)
      .set({
        tournamentId: formData.tournamentId,
        partyDateTime,
        location: formData.location,
        maxAttendees: parseInt(formData.maxAttendees),
        updatedAt: new Date(),
      })
      .where(eq(watchParties.id, watchPartyId));

    // Revalidate the watch parties page
    revalidatePath("/dashboard/watch-parties");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating watch party:", error);
    return { success: false, error: "Failed to update watch party" };
  }
}

// Delete a watch party
export async function deleteWatchParty(watchPartyId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to delete a watch party");
  }

  try {
    // Check if the watch party exists and user is the creator
    const existingWatchParty = await db
      .select()
      .from(watchParties)
      .where(
        and(
          eq(watchParties.id, watchPartyId),
          eq(watchParties.creatorId, user.id)
        )
      )
      .limit(1);

    if (existingWatchParty.length === 0) {
      return {
        success: false,
        error:
          "Watch party not found or you don't have permission to delete it",
      };
    }

    // Delete the watch party (cascade will handle attendees)
    await db.delete(watchParties).where(eq(watchParties.id, watchPartyId));

    // Revalidate the watch parties page
    revalidatePath("/dashboard/watch-parties");
    return { success: true };
  } catch (error) {
    console.error("Error deleting watch party:", error);
    return { success: false, error: "Failed to delete watch party" };
  }
}

// Join a watch party
export async function joinWatchParty(watchPartyId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to join a watch party");
  }

  try {
    // Check if the watch party exists
    const watchParty = await db
      .select({
        id: watchParties.id,
        maxAttendees: watchParties.maxAttendees,
      })
      .from(watchParties)
      .where(eq(watchParties.id, watchPartyId))
      .limit(1);

    if (watchParty.length === 0) {
      return {
        success: false,
        error: "Watch party not found",
      };
    }

    // Check if user is already an attendee
    const existingAttendance = await db
      .select()
      .from(watchPartyAttendees)
      .where(
        and(
          eq(watchPartyAttendees.watchPartyId, watchPartyId),
          eq(watchPartyAttendees.userId, user.id)
        )
      )
      .limit(1);

    if (existingAttendance.length > 0) {
      return {
        success: false,
        error: "You are already attending this watch party",
      };
    }

    // Check if the watch party is at max capacity
    const currentAttendees = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchPartyAttendees)
      .where(eq(watchPartyAttendees.watchPartyId, watchPartyId));

    if (currentAttendees[0].count >= watchParty[0].maxAttendees) {
      return {
        success: false,
        error: "This watch party is at maximum capacity",
      };
    }

    // Join the watch party
    await db.insert(watchPartyAttendees).values({
      userId: user.id,
      watchPartyId,
      joinedAt: new Date(),
    });

    // Revalidate the watch parties page
    revalidatePath("/dashboard/watch-parties");
    return { success: true };
  } catch (error) {
    console.error("Error joining watch party:", error);
    return { success: false, error: "Failed to join watch party" };
  }
}

// Leave a watch party
export async function leaveWatchParty(watchPartyId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to leave a watch party");
  }

  try {
    // Check if user is an attendee
    const existingAttendance = await db
      .select()
      .from(watchPartyAttendees)
      .where(
        and(
          eq(watchPartyAttendees.watchPartyId, watchPartyId),
          eq(watchPartyAttendees.userId, user.id)
        )
      )
      .limit(1);

    if (existingAttendance.length === 0) {
      return {
        success: false,
        error: "You are not attending this watch party",
      };
    }

    // Check if user is the creator
    const isCreator = await db
      .select()
      .from(watchParties)
      .where(
        and(
          eq(watchParties.id, watchPartyId),
          eq(watchParties.creatorId, user.id)
        )
      )
      .limit(1);

    if (isCreator.length > 0) {
      return {
        success: false,
        error:
          "As the organizer, you cannot leave the watch party. You can delete it instead.",
      };
    }

    // Leave the watch party
    await db
      .delete(watchPartyAttendees)
      .where(
        and(
          eq(watchPartyAttendees.watchPartyId, watchPartyId),
          eq(watchPartyAttendees.userId, user.id)
        )
      );

    // Revalidate the watch parties page
    revalidatePath("/dashboard/watch-parties");
    return { success: true };
  } catch (error) {
    console.error("Error leaving watch party:", error);
    return { success: false, error: "Failed to leave watch party" };
  }
}

// Get all watch parties for the current user
export async function getUserWatchParties() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view watch parties");
  }

  try {
    // Get watch parties the user is attending
    const userWatchParties = await db
      .select({
        watchPartyId: watchParties.id,
        tournamentId: watchParties.tournamentId,
        tournamentName: tournaments.name,
        game: tournaments.gameTitle,
        partyDate: watchParties.partyDateTime,
        location: watchParties.location,
        maxAttendees: watchParties.maxAttendees,
        creatorId: watchParties.creatorId,
        createdAt: watchParties.createdAt,
        updatedAt: watchParties.updatedAt,
        joinedAt: watchPartyAttendees.joinedAt,
      })
      .from(watchPartyAttendees)
      .innerJoin(
        watchParties,
        eq(watchPartyAttendees.watchPartyId, watchParties.id)
      )
      .innerJoin(tournaments, eq(watchParties.tournamentId, tournaments.id))
      .where(eq(watchPartyAttendees.userId, user.id));

    // Get attendee counts for each watch party
    const result = await Promise.all(
      userWatchParties.map(async (watchParty) => {
        const attendeeCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(watchPartyAttendees)
          .where(eq(watchPartyAttendees.watchPartyId, watchParty.watchPartyId));

        return {
          ...watchParty,
          attendeeCount: attendeeCount[0].count,
          // Format the time from the date
          time: new Date(watchParty.partyDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          // Just keep the date part for the date
          date: new Date(watchParty.partyDate),
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching watch parties:", error);
    return [];
  }
}

// Get all available watch parties (that the user is not attending)
export async function getAvailableWatchParties() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view available watch parties");
  }

  try {
    // Get watch parties where the user is NOT an attendee
    const userAttendingPartyIds = await db
      .select({ watchPartyId: watchPartyAttendees.watchPartyId })
      .from(watchPartyAttendees)
      .where(eq(watchPartyAttendees.userId, user.id));

    const excludePartyIds = userAttendingPartyIds.map((p) => p.watchPartyId);

    // Get all watch parties except those the user is already attending
    let availableParties;
    if (excludePartyIds.length > 0) {
      availableParties = await db
        .select({
          id: watchParties.id,
          tournamentId: watchParties.tournamentId,
          tournamentName: tournaments.name,
          game: tournaments.gameTitle,
          partyDate: watchParties.partyDateTime,
          location: watchParties.location,
          maxAttendees: watchParties.maxAttendees,
          creatorId: watchParties.creatorId,
          createdAt: watchParties.createdAt,
        })
        .from(watchParties)
        .innerJoin(tournaments, eq(watchParties.tournamentId, tournaments.id))
        .where(not(inArray(watchParties.id, excludePartyIds)));
    } else {
      // If user is not attending any watch parties, get all watch parties
      availableParties = await db
        .select({
          id: watchParties.id,
          tournamentId: watchParties.tournamentId,
          tournamentName: tournaments.name,
          game: tournaments.gameTitle,
          partyDate: watchParties.partyDateTime,
          location: watchParties.location,
          maxAttendees: watchParties.maxAttendees,
          creatorId: watchParties.creatorId,
          createdAt: watchParties.createdAt,
        })
        .from(watchParties)
        .innerJoin(tournaments, eq(watchParties.tournamentId, tournaments.id));
    }

    // Get attendee counts for each watch party
    const result = await Promise.all(
      availableParties.map(async (party) => {
        const attendeeCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(watchPartyAttendees)
          .where(eq(watchPartyAttendees.watchPartyId, party.id));

        return {
          ...party,
          attendeeCount: attendeeCount[0].count,
          // Format the time from the date
          time: new Date(party.partyDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
          // Just keep the date part for the date
          date: new Date(party.partyDate),
        };
      })
    );

    return result;
  } catch (error) {
    console.error("Error fetching available watch parties:", error);
    return [];
  }
}

// Get all tournaments for selection in the watch party form
export async function getWatchPartyTournaments() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view tournaments");
  }

  try {
    const tournamentOptions = await db
      .select({
        id: tournaments.id,
        name: tournaments.name,
      })
      .from(tournaments);

    return tournamentOptions;
  } catch (error) {
    console.error(
      "Error fetching tournaments for watch party selection:",
      error
    );
    return [];
  }
}

// Get attendee count for a watch party
export async function getWatchPartyAttendeeCount(watchPartyId: number) {
  try {
    const attendees = await db
      .select({ count: sql<number>`count(*)` })
      .from(watchPartyAttendees)
      .where(eq(watchPartyAttendees.watchPartyId, watchPartyId));

    return { success: true, count: attendees[0].count };
  } catch (error) {
    console.error("Error counting watch party attendees:", error);
    return { success: false, error: "Failed to count attendees", count: 0 };
  }
}
