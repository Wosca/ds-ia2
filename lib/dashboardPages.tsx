import { Gamepad, HomeIcon, School, Trophy, User, Users } from "lucide-react";

export function getDashboardPages() {
  return [
    {
      name: "Dashboard",
      icon: <HomeIcon className="h-4 w-4" />,
      href: "/dashboard",
    },
    {
      name: "Labs",
      icon: <School className="h-4 w-4" />,
      href: "/dashboard/labs",
    },
    {
      name: "Teams",
      icon: <Users className="h-4 w-4" />,
      href: "/dashboard/teams",
    },
    {
      name: "Tournaments",
      icon: <Trophy className="h-4 w-4" />,
      href: "/dashboard/tournaments",
    },
    {
      name: "Watch Parties",
      icon: <Gamepad className="h-4 w-4" />,
      href: "/dashboard/watch-parties",
    },
    {
      name: "Profile",
      icon: <User className="h-4 w-4" />,
      href: "/dashboard/profile",
    },
  ];
}
