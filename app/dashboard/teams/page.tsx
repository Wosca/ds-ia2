import { getUserTeams, getAvailableTeams } from "@/lib/teamActions";
import PageBackground from "@/components/PageBackground";
import TeamsPageClient from "./TeamsPageClient";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function TeamsPage() {
  const userTeams = await getUserTeams();
  const availableTeams = await getAvailableTeams();
  const user = await currentUser();
  if (user === null) {
    redirect("/");
  }

  const userObject = {
    id: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  return (
    <PageBackground>
      <TeamsPageClient
        userTeams={userTeams}
        availableTeams={availableTeams}
        user={userObject}
      />
    </PageBackground>
  );
}
