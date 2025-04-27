import { getLabs, getUserLabBookings } from "@/lib/dbActions";
import {
  createBooking,
  updateBooking,
  deleteBooking,
  getClientUserTeams,
} from "@/lib/bookingActions";
import PageBackground from "@/components/PageBackground";
import LabsPageClient from "./LabsPageClient";

export default async function BookingsPage() {
  const bookings = await getUserLabBookings();
  const labs = await getLabs();

  return (
    <PageBackground>
      <LabsPageClient
        bookings={bookings}
        labs={labs}
        createBooking={createBooking}
        updateBooking={updateBooking}
        deleteBooking={deleteBooking}
        getClientUserTeams={getClientUserTeams}
      />
    </PageBackground>
  );
}
