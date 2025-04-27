"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/animated-tabs";
import {
  Calendar,
  Computer,
  Laptop,
  MapPin,
  Clock,
  Users,
  CalendarIcon,
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { BookingDialog } from "./BookingDialog";

// Define the types for our props
interface LabsPageClientProps {
  bookings: {
    bookingId: number;
    bookingDate: string;
    createdAt: Date;
    labId: number;
    labName: string;
    teamId: number;
    teamName: string;
    bookedById: string;
    bookedByFirstName: string;
    bookedByLastName: string;
  }[];
  labs: {
    id: number;
    name: string;
    computerCount: number;
    description: string | null;
    createdAt: Date;
  }[];
  createBooking: (data: {
    labId: number;
    teamId: number;
    bookingDate: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateBooking: (
    bookingId: number,
    data: { labId: number; teamId: number; bookingDate: string }
  ) => Promise<{ success: boolean; error?: string }>;
  deleteBooking: (
    bookingId: number
  ) => Promise<{ success: boolean; error?: string }>;
  getClientUserTeams: () => Promise<{ teamId: number; teamName: string }[]>;
}

// Type for booking data
type BookingData = {
  bookingId: number;
  labId: number;
  teamId: number;
  bookingDate: Date;
  labName: string;
  teamName: string;
};

export default function LabsPageClient({
  bookings,
  labs,
  createBooking,
  updateBooking,
  deleteBooking,
  getClientUserTeams,
}: LabsPageClientProps) {
  const router = useRouter();

  // BookingDialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<
    BookingData | undefined
  >(undefined);
  const [initialLabId, setInitialLabId] = useState<number | undefined>(
    undefined
  );

  // Handle successful booking actions
  const handleActionComplete = () => {
    closeDialog();
    router.refresh();
  };

  // Open create booking dialog
  const openCreateDialog = (labId?: number) => {
    setSelectedBooking(undefined);
    setInitialLabId(labId);
    setDialogOpen(true);
  };

  // Open edit booking dialog
  const openEditDialog = (booking: BookingData) => {
    setSelectedBooking(booking);
    setInitialLabId(undefined);
    setDialogOpen(true);
  };

  // Close dialog and reset state
  const closeDialog = () => {
    setDialogOpen(false);
    // Reset state after dialog animation completes
    setTimeout(() => {
      setSelectedBooking(undefined);
      setInitialLabId(undefined);
    }, 300);
  };

  return (
    <div className="px-4 sm:px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Lab Bookings</h1>
          <p className="text-muted-foreground">
            Book computer labs for team practice and competitions
          </p>
        </div>
        <Button onClick={() => openCreateDialog()}>
          <CalendarIcon className="mr-2 h-4 w-4" /> Create New Booking
        </Button>
      </div>

      <Tabs defaultValue="my-bookings" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-bookings">
            <Calendar className="h-4 w-4 mr-2" />
            My Bookings
          </TabsTrigger>
          <TabsTrigger value="available-labs">
            <Computer className="h-4 w-4 mr-2" />
            Available Labs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-bookings" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <Card key={booking.bookingId}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{booking.labName}</CardTitle>
                        <CardDescription>
                          {format(
                            new Date(booking.bookingDate),
                            "EEEE, MMMM d, yyyy"
                          )}
                        </CardDescription>
                      </div>
                      <div className="bg-secondary p-2 rounded-full">
                        <Laptop className="h-4 w-4 text-secondary-foreground" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Team:{" "}
                          <span className="font-medium">
                            {booking.teamName}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Location:{" "}
                          <span className="font-medium">{booking.labName}</span>
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <p className="text-sm">
                          Time:{" "}
                          <span className="font-medium">
                            {format(new Date(booking.bookingDate), "h:mm a")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openEditDialog({
                          bookingId: booking.bookingId,
                          labId: booking.labId,
                          teamId: booking.teamId,
                          bookingDate: new Date(booking.bookingDate),
                          labName: booking.labName,
                          teamName: booking.teamName,
                        })
                      }
                    >
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 rounded-lg border border-dashed space-y-2 text-center text-muted-foreground">
                <Calendar className="h-10 w-10 mb-2 text-muted-foreground/70" />
                <h3 className="font-medium">No Bookings Found</h3>
                <p className="text-sm">
                  You don&apos;t have any upcoming lab bookings
                </p>
                <Button onClick={() => openCreateDialog()}>
                  <CalendarIcon className="mr-2 h-4 w-4" /> Create New Booking
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="available-labs">
          <Card>
            <CardHeader>
              <CardTitle>Available Computer Labs</CardTitle>
              <CardDescription>
                Browse and book labs for your team practice sessions
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[400px]">
                <div className="p-4 space-y-2">
                  {labs.map((lab) => (
                    <div
                      key={lab.id}
                      className="flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="bg-secondary h-8 w-8 rounded-full flex items-center justify-center mr-3">
                          <Computer className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{lab.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {lab.computerCount} computers
                          </p>
                        </div>
                      </div>
                      <Button onClick={() => openCreateDialog(lab.id)}>
                        <CalendarIcon className="mr-2 h-4 w-4" /> Book Now
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BookingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        labs={labs}
        booking={selectedBooking}
        initialLabId={initialLabId}
        onComplete={handleActionComplete}
        createBooking={createBooking}
        updateBooking={updateBooking}
        deleteBooking={deleteBooking}
        getClientUserTeams={getClientUserTeams}
      />
    </div>
  );
}
