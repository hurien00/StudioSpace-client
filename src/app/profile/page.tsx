"use client";

import Link from "next/link";
import { Calendar, List, Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import PrivateRoute from "@/components/PrivateRoute";

function ProfileContent() {
  const user = useAuthUser();

  const initials =
    user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "SS";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="px-6 sm:px-8 pb-8">
          <Avatar className="h-24 w-24 border-4 border-card -mt-12 shadow-lg">
            <AvatarImage src={user?.image} alt={user?.name || "StudioSpace user"} />
            <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
          </Avatar>

          <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              {user?.name || "StudioSpace creator"}
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-2xl border border-border bg-background">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Display name
              </p>
              <p className="text-sm font-bold text-foreground mt-1 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-indigo-500" />
                {user?.name || "Not set"}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-background">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Account status
              </p>
              <p className="text-sm font-bold text-foreground mt-1 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Verified session
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button className="rounded-full gap-2" asChild>
              <Link href="/my-listings">
                <List className="w-4 h-4" /> My Studio Listings
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full gap-2" asChild>
              <Link href="/my-bookings">
                <Calendar className="w-4 h-4" /> My Bookings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}
