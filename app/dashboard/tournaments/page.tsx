import PageBackground from "@/components/PageBackground";
import TeamsPageClient from "./TournamentsPageClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getAvailableTournaments,
  getUserTournaments,
} from "@/lib/tournamentActions";

export default async function TeamsPage() {
  const userTeams = await getUserTournaments();
  const availableTournaments = await getAvailableTournaments();
  const user = await currentUser();
  if (user === null) {
    redirect("/");
  }

  const userObject = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  const userTournaments = userTeams.map((team) => ({
    tournamentId: team.tournamentId,
    tournamentName: team.tournamentName,
    game: team.game,
    genre: team.genre,
    date: new Date(team.date),
    prizeFund: team.prizeFund,
    creatorId: team.creatorId,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    registeredAt: team.registeredAt,
  }));

  const avaliableTournamentsFixed = availableTournaments.map((tournament) => ({
    id: tournament.id,
    name: tournament.name,
    game: tournament.game,
    genre: tournament.genre,
    date: new Date(tournament.date),
    prizeFund: tournament.prizeFund,
    creatorId: tournament.creatorId,
    createdAt: tournament.createdAt,
  }));

  return (
    <PageBackground>
      <TeamsPageClient
        userTournaments={userTournaments}
        availableTournaments={avaliableTournamentsFixed}
        user={userObject}
      />
    </PageBackground>
  );
}
