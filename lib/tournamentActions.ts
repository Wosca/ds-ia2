"use server";

import { db } from "@/db";
import { tournaments, watchParties, watchPartyAttendees } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, not, inArray, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Interface for tournament creation/update
interface TournamentFormData {
  name: string;
  game: string;
  genre: string;
  date: Date;
  prizeFund: string;
}

// Create a new tournament
export async function createTournament(formData: TournamentFormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a tournament");
  }

  try {
    // Create the tournament
    const result = await db
      .insert(tournaments)
      .values({
        name: formData.name,
        date: formData.date.toISOString(),
        gameTitle: formData.game,
        genre: formData.genre,
        prizeFund: formData.prizeFund,
      })
      .returning({ id: tournaments.id });

    const tournamentId = result[0].id;

    // Revalidate the tournaments page
    revalidatePath("/dashboard/tournaments");
    return { success: true, tournamentId };
  } catch (error: unknown) {
    console.error("Error creating tournament:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        success: false,
        error:
          "A tournament with that name already exists. Please choose a different name.",
      };
    }
    return { success: false, error: "Failed to create tournament" };
  }
}

// Update an existing tournament
export async function updateTournament(
  tournamentId: number,
  formData: TournamentFormData
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to update a tournament");
  }

  try {
    // Check if the tournament exists and user is the creator
    const existingWatchParty = await db
      .select()
      .from(watchParties)
      .where(
        and(
          eq(watchParties.tournamentId, tournamentId),
          eq(watchParties.creatorId, user.id)
        )
      )
      .limit(1);

    if (existingWatchParty.length === 0) {
      return {
        success: false,
        error: "Tournament not found or you don't have permission to edit it",
      };
    }

    // Update the tournament
    await db
      .update(tournaments)
      .set({
        name: formData.name,
        date: formData.date.toISOString(),
        gameTitle: formData.game,
        genre: formData.genre,
        prizeFund: formData.prizeFund,
      })
      .where(eq(tournaments.id, tournamentId));

    // Revalidate the tournaments page
    revalidatePath("/dashboard/tournaments");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating tournament:", error);
    if (error instanceof Error && error.message.includes("unique constraint")) {
      return {
        success: false,
        error:
          "A tournament with that name already exists. Please choose a different name.",
      };
    }
    return { success: false, error: "Failed to update tournament" };
  }
}

// Delete a tournament
export async function deleteTournament(tournamentId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to delete a tournament");
  }

  try {
    // Check if the user is the creator of any watch party for this tournament
    const existingWatchParty = await db
      .select()
      .from(watchParties)
      .where(
        and(
          eq(watchParties.tournamentId, tournamentId),
          eq(watchParties.creatorId, user.id)
        )
      )
      .limit(1);

    if (existingWatchParty.length === 0) {
      return {
        success: false,
        error: "Tournament not found or you don't have permission to delete it",
      };
    }

    // Delete the tournament (cascade will handle watch parties)
    await db.delete(tournaments).where(eq(tournaments.id, tournamentId));

    // Revalidate the tournaments page
    revalidatePath("/dashboard/tournaments");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tournament:", error);
    return { success: false, error: "Failed to delete tournament" };
  }
}

// Register for a tournament
export async function registerForTournament(tournamentId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to register for a tournament");
  }

  try {
    // Check if there's an existing watch party for this tournament
    let watchPartyId: number;

    const existingWatchParties = await db
      .select()
      .from(watchParties)
      .where(eq(watchParties.tournamentId, tournamentId))
      .limit(1);

    if (existingWatchParties.length === 0) {
      // Instead of automatically creating a watch party,
      // just return a message that directs the user to the watch parties page
      return {
        success: false,
        error:
          "No watch party exists for this tournament yet. Please check the Watch Parties page to join an existing party or create a new one.",
      };
    } else {
      watchPartyId = existingWatchParties[0].id;
    }

    // Check if user is already registered
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
        error: "You are already registered for this tournament",
      };
    }

    // Check if the watch party is at max capacity
    const watchPartyDetails = await db
      .select({ maxAttendees: watchParties.maxAttendees })
      .from(watchParties)
      .where(eq(watchParties.id, watchPartyId))
      .limit(1);

    const attendeeCount = await db
      .select({ count: count() })
      .from(watchPartyAttendees)
      .where(eq(watchPartyAttendees.watchPartyId, watchPartyId));

    if (attendeeCount[0].count >= watchPartyDetails[0].maxAttendees) {
      return {
        success: false,
        error:
          "This watch party has reached its maximum capacity. Please check if there are other watch parties available.",
      };
    }

    // Register user for the tournament via watch party
    await db.insert(watchPartyAttendees).values({
      userId: user.id,
      watchPartyId,
      joinedAt: new Date(),
    });

    // Revalidate the tournaments page
    revalidatePath("/dashboard/tournaments");
    return { success: true };
  } catch (error) {
    console.error("Error registering for tournament:", error);
    return { success: false, error: "Failed to register for tournament" };
  }
}

// Unregister from a tournament
export async function unregisterFromTournament(tournamentId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to unregister from a tournament");
  }

  try {
    // Find the watch party for this tournament
    const watchParty = await db
      .select()
      .from(watchParties)
      .where(eq(watchParties.tournamentId, tournamentId))
      .limit(1);

    if (watchParty.length === 0) {
      return {
        success: false,
        error: "Tournament watch party not found",
      };
    }

    const watchPartyId = watchParty[0].id;

    // Check if user is registered
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
        error: "You are not registered for this tournament",
      };
    }

    // Unregister user from the tournament watch party
    await db
      .delete(watchPartyAttendees)
      .where(
        and(
          eq(watchPartyAttendees.watchPartyId, watchPartyId),
          eq(watchPartyAttendees.userId, user.id)
        )
      );

    // Revalidate the tournaments page
    revalidatePath("/dashboard/tournaments");
    return { success: true };
  } catch (error) {
    console.error("Error unregistering from tournament:", error);
    return { success: false, error: "Failed to unregister from tournament" };
  }
}

// Get all tournaments for the current user
export async function getUserTournaments() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view tournaments");
  }

  try {
    // Get tournaments the user is attending or created watch parties for
    const userTournaments = await db
      .select({
        tournamentId: tournaments.id,
        tournamentName: tournaments.name,
        game: tournaments.gameTitle,
        genre: tournaments.genre,
        date: tournaments.date,
        prizeFund: tournaments.prizeFund,
        creatorId: watchParties.creatorId,
        createdAt: watchParties.createdAt,
        updatedAt: watchParties.updatedAt,
        registeredAt: watchPartyAttendees.joinedAt,
      })
      .from(watchPartyAttendees)
      .innerJoin(
        watchParties,
        eq(watchPartyAttendees.watchPartyId, watchParties.id)
      )
      .innerJoin(tournaments, eq(watchParties.tournamentId, tournaments.id))
      .where(eq(watchPartyAttendees.userId, user.id));

    return userTournaments;
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    return [];
  }
}

// Get all available public tournaments (for registration)
export async function getAvailableTournaments() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to view available tournaments");
  }

  try {
    // Get tournaments where the user is NOT registered
    const userAttendingWatchParties = await db
      .select({
        tournamentId: watchParties.tournamentId,
      })
      .from(watchPartyAttendees)
      .innerJoin(
        watchParties,
        eq(watchPartyAttendees.watchPartyId, watchParties.id)
      )
      .where(eq(watchPartyAttendees.userId, user.id));

    const excludeTournamentIds = userAttendingWatchParties.map(
      (t) => t.tournamentId
    );

    // Get all tournaments except those the user is already registered for
    let availableTournaments;
    if (excludeTournamentIds.length > 0) {
      availableTournaments = await db
        .select({
          id: tournaments.id,
          name: tournaments.name,
          game: tournaments.gameTitle,
          genre: tournaments.genre,
          date: tournaments.date,
          prizeFund: tournaments.prizeFund,
          creatorId: watchParties.creatorId,
          createdAt: watchParties.createdAt,
        })
        .from(tournaments)
        .leftJoin(watchParties, eq(tournaments.id, watchParties.tournamentId))
        .where(not(inArray(tournaments.id, excludeTournamentIds)));
    } else {
      // If user is not registered for any tournaments, get all tournaments
      availableTournaments = await db
        .select({
          id: tournaments.id,
          name: tournaments.name,
          game: tournaments.gameTitle,
          genre: tournaments.genre,
          date: tournaments.date,
          prizeFund: tournaments.prizeFund,
          creatorId: watchParties.creatorId,
          createdAt: watchParties.createdAt,
        })
        .from(tournaments)
        .leftJoin(watchParties, eq(tournaments.id, watchParties.tournamentId));
    }

    return availableTournaments;
  } catch (error) {
    console.error("Error fetching available tournaments:", error);
    return [];
  }
}

// Create a watch party for a tournament
export async function createWatchParty(
  tournamentId: number,
  partyDateTime: Date,
  location: string = "TBD",
  maxAttendees: number = 30
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a watch party");
  }

  try {
    // Create a new watch party
    const result = await db
      .insert(watchParties)
      .values({
        tournamentId,
        creatorId: user.id,
        partyDateTime,
        location,
        maxAttendees,
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

    // Revalidate the tournaments and watch parties pages
    revalidatePath("/dashboard/tournaments");
    revalidatePath("/dashboard/watch-parties");
    return { success: true, watchPartyId };
  } catch (error) {
    console.error("Error creating watch party:", error);
    return { success: false, error: "Failed to create watch party" };
  }
}

// Get attendee count for a watch party
export async function getWatchPartyAttendeeCount(watchPartyId: number) {
  try {
    const attendees = await db
      .select({ userId: watchPartyAttendees.userId })
      .from(watchPartyAttendees)
      .where(eq(watchPartyAttendees.watchPartyId, watchPartyId));

    return { success: true, count: attendees.length };
  } catch (error) {
    console.error("Error counting watch party attendees:", error);
    return { success: false, error: "Failed to count attendees", count: 0 };
  }
}
