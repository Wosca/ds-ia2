import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageBackground from "@/components/PageBackground";
import WatchPartiesPageClient from "./WatchPartiesPageClient";
import {
  getUserWatchParties,
  getAvailableWatchParties,
  getWatchPartyTournaments,
} from "@/lib/watchPartyActions";

export default async function WatchPartiesPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  // Fetch watch parties data
  const [userWatchParties, availableWatchParties, tournamentOptions] =
    await Promise.all([
      getUserWatchParties(),
      getAvailableWatchParties(),
      getWatchPartyTournaments(),
    ]);

  return (
    <PageBackground>
      <WatchPartiesPageClient
        userWatchParties={userWatchParties}
        availableWatchParties={availableWatchParties}
        tournamentOptions={tournamentOptions}
        user={{
          id: user.id,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
        }}
      />
    </PageBackground>
  );
}
