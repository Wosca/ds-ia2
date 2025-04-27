import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  date,
  uniqueIndex,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["student", "teacher"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull().unique(),
  role: userRoleEnum("role").notNull().default("student"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const teamMembers = pgTable(
  "team_members",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.teamId] })]
);

export const computerLabs = pgTable("computer_labs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  computerCount: integer("computer_count").notNull().default(0),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
});

export const labBookings = pgTable(
  "lab_bookings",
  {
    id: serial("id").primaryKey(),
    labId: integer("lab_id")
      .notNull()
      .references(() => computerLabs.id, { onDelete: "restrict" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    bookingDate: date("booking_date").notNull(),
    bookedByUserId: text("booked_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("unique_booking_idx").on(table.labId, table.bookingDate),
  ]
);

export const tournaments = pgTable(
  "tournaments",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    date: date("date").notNull(),
    gameTitle: text("game_title").notNull(),
    genre: text("genre"),
    prizeFund: text("prize_fund"),
  },
  (table) => [
    uniqueIndex("tournament_name_idx").on(table.name),
    uniqueIndex("tournament_date_idx").on(table.date),
    uniqueIndex("tournament_game_idx").on(table.gameTitle),
  ]
);

export const watchParties = pgTable("watch_parties", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id")
    .notNull()
    .references(() => tournaments.id, { onDelete: "cascade" }),
  creatorId: text("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  partyDateTime: timestamp("party_date_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const watchPartyAttendees = pgTable(
  "watch_party_attendees",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    watchPartyId: integer("watch_party_id")
      .notNull()
      .references(() => watchParties.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.watchPartyId] })]
);

// Relations remain unchanged
export const usersRelations = relations(users, ({ many }) => ({
  createdTeams: many(teams),
  teamMemberships: many(teamMembers),
  createdLabBookings: many(labBookings),
  createdWatchParties: many(watchParties),
  watchPartyAttendances: many(watchPartyAttendees),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  creator: one(users, {
    fields: [teams.creatorId],
    references: [users.id],
    relationName: "teamCreator",
  }),
  members: many(teamMembers),
  labBookings: many(labBookings),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const computerLabsRelations = relations(computerLabs, ({ many }) => ({
  bookings: many(labBookings),
}));

export const labBookingsRelations = relations(labBookings, ({ one }) => ({
  lab: one(computerLabs, {
    fields: [labBookings.labId],
    references: [computerLabs.id],
  }),
  team: one(teams, {
    fields: [labBookings.teamId],
    references: [teams.id],
  }),
  bookedByUser: one(users, {
    fields: [labBookings.bookedByUserId],
    references: [users.id],
  }),
}));

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  watchParties: many(watchParties),
}));

export const watchPartiesRelations = relations(
  watchParties,
  ({ one, many }) => ({
    tournament: one(tournaments, {
      fields: [watchParties.tournamentId],
      references: [tournaments.id],
    }),
    creator: one(users, {
      fields: [watchParties.creatorId],
      references: [users.id],
      relationName: "watchPartyCreator",
    }),
    attendees: many(watchPartyAttendees),
  })
);

export const watchPartyAttendeesRelations = relations(
  watchPartyAttendees,
  ({ one }) => ({
    user: one(users, {
      fields: [watchPartyAttendees.userId],
      references: [users.id],
    }),
    watchParty: one(watchParties, {
      fields: [watchPartyAttendees.watchPartyId],
      references: [watchParties.id],
    }),
  })
);
