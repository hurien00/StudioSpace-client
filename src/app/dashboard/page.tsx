"use client";

import Link from "next/link";
import {
  Calendar,
  LayoutDashboard,
  List,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import PrivateRoute from "@/components/PrivateRoute";

const cards = [
  {
    title: "My Studio Listings",
    description: "Update pricing, photos and amenities for the spaces you host.",
    href: "/my-listings",
    icon: List,
    accent: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    title: "My Bookings",
    description: "Track pending, confirmed and completed reservations.",
    href: "/my-bookings",
    icon: Calendar,
    accent: "text-pink-500 bg-pink-500/10 border-pink-500/20",
  },
  {
    title: "Add New Studio",
    description: "Publish another creative space to the marketplace.",
    href: "/add-studio",
    icon: PlusCircle,
    accent: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
];

function DashboardContent() {
  const user = useAuthUser();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SS";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-border">
            <AvatarImage src={user?.image} alt={user?.name || "StudioSpace user"} />
            <AvatarFallback className="text-lg font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Welcome back, {user?.name?.split(" ")[0] || "creator"}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </div>
        </div>
        <Button className="rounded-full gap-2" asChild>
          <Link href="/studios">
            Explore Studios <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group p-6 rounded-3xl bg-card border border-border shadow-xs hover:shadow-md hover:border-primary/40 transition space-y-4"
            >
              <div
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${card.accent}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-foreground group-hover:text-primary transition">
                  {card.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.description}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-foreground">
                Open <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 p-6 rounded-3xl border border-border bg-card flex items-start gap-3">
        <LayoutDashboard className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tip: listings and bookings are filtered with the email on your account,
          so all your spaces and reservations stay in one place.
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardContent />
    </PrivateRoute>
  );
}
