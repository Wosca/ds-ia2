"use server";

import { db } from "@/db";
import { labBookings } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { teamMembers, teams } from "@/db/schema";

// Interface for booking creation data
interface BookingFormData {
  labId: number;
  teamId: number;
  bookingDate: string; // ISO string format
}

// Create a new booking
export async function createBooking(formData: BookingFormData) {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a booking");
  }

  try {
    // Insert the new booking
    await db.insert(labBookings).values({
      labId: formData.labId,
      teamId: formData.teamId,
      bookingDate: new Date(formData.bookingDate).toISOString(),
      bookedByUserId: user.id,
      createdAt: new Date(),
    });

    // Revalidate the labs page to show the new booking
    revalidatePath("/dashboard/labs");
    return { success: true };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

// Update an existing booking
export async function updateBooking(
  bookingId: number,
  formData: BookingFormData
) {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to update a booking");
  }

  try {
    // Check if the booking exists and belongs to the user
    const existingBooking = await db
      .select()
      .from(labBookings)
      .where(
        and(
          eq(labBookings.id, bookingId),
          eq(labBookings.bookedByUserId, user.id)
        )
      )
      .limit(1);

    if (existingBooking.length === 0) {
      return {
        success: false,
        error: "Booking not found or you don't have permission to edit it",
      };
    }

    // Update the booking
    await db
      .update(labBookings)
      .set({
        labId: formData.labId,
        teamId: formData.teamId,
        bookingDate: new Date(formData.bookingDate).toISOString(),
      })
      .where(eq(labBookings.id, bookingId));

    // Revalidate the labs page to show the updated booking
    revalidatePath("/dashboard/labs");
    return { success: true };
  } catch (error) {
    console.error("Error updating booking:", error);
    return { success: false, error: "Failed to update booking" };
  }
}

// Delete a booking
export async function deleteBooking(bookingId: number) {
  "use server";
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to delete a booking");
  }

  try {
    // Check if the booking exists and belongs to the user
    const existingBooking = await db
      .select()
      .from(labBookings)
      .where(
        and(
          eq(labBookings.id, bookingId),
          eq(labBookings.bookedByUserId, user.id)
        )
      )
      .limit(1);

    if (existingBooking.length === 0) {
      return {
        success: false,
        error: "Booking not found or you don't have permission to delete it",
      };
    }

    // Delete the booking
    await db.delete(labBookings).where(eq(labBookings.id, bookingId));

    // Revalidate the labs page
    revalidatePath("/dashboard/labs");
    return { success: true };
  } catch (error) {
    console.error("Error deleting booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

// Fetch teams for the logged-in user - safe to use in client components
export async function getClientUserTeams() {
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
