import { db } from "@/db";
import {
  labBookings,
  teamMembers,
  teams,
  computerLabs,
  users,
} from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, gt } from "drizzle-orm";

export async function getUserLabBookings() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }
  const response = await db
    .select({
      bookingId: labBookings.id,
      bookingDate: labBookings.bookingDate,
      createdAt: labBookings.createdAt,
      labId: computerLabs.id,
      labName: computerLabs.name,
      teamId: teams.id,
      teamName: teams.name,
      bookedById: users.id,
      bookedByFirstName: users.firstName,
      bookedByLastName: users.lastName,
    })
    .from(labBookings)
    .innerJoin(computerLabs, eq(labBookings.labId, computerLabs.id))
    .innerJoin(teams, eq(labBookings.teamId, teams.id))
    .innerJoin(users, eq(labBookings.bookedByUserId, users.id))
    .where(
      and(
        gt(labBookings.bookingDate, new Date().toISOString()),
        eq(labBookings.bookedByUserId, user.id)
      )
    );

  return response;
}

export async function getLabs() {
  const labs = await db.select().from(computerLabs);

  return labs;
}

export async function getUserTeams() {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

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
}
