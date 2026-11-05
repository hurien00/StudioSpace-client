"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  XCircle, 
  CheckCircle2, 
  Layers 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthUser, useIsClient } from "@/hooks/use-auth-user";

interface Booking {
  _id: string;
  studioTitle: string;
  studioImage: string;
  location: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  userEmail: string;
}

export default function MyBookingsClient() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const isClient = useIsClient();
  const user = useAuthUser();
  const userEmail = user?.email ?? null;

  useEffect(() => {
    if (!isClient || userEmail) return;

    sessionStorage.setItem("redirectPath", window.location.pathname);
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
  }, [isClient, userEmail, router]);

  useEffect(() => {
    if (!userEmail) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/api/bookings?email=${encodeURIComponent(userEmail)}`, {
          method: "GET",
          credentials: "include", 
        });

        if (res.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setBookings(data);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userEmail, router]);

  const handleCancelBooking = (id: string) => {
    setCancellingId(id);

    fetch(`http://localhost:8000/api/bookings/${id}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 401) {
          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
          throw new Error("401 Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to cancel booking");
        return res.json();
      })
      .then(() => {
        setBookings((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: "Cancelled" } : item
          )
        );
        setToastMessage("Booking cancelled successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      })
      .catch((err) => {
        console.error("Cancellation error:", err);
      })
      .finally(() => {
        setCancellingId(null);
      });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase tracking-wider">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-extrabold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-extrabold uppercase tracking-wider">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Loading your reservations...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white shadow-xl animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <div className="mb-8 pb-6 border-b border-border">
        <h1 className="text-3xl font-black text-foreground tracking-tight">My Bookings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          View your reserved studio slots, track reservation status, or cancel pending bookings.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Bookings Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven&apos;t reserved any studio spaces yet. Explore available studios and book your slot!
          </p>
          <Button className="rounded-full px-6 mt-2" asChild>
            <Link href="/studios">Explore Studios</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={booking.studioImage || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0"}
                    alt={booking.studioTitle}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-base font-bold text-foreground line-clamp-1">{booking.studioTitle}</h3>
                  
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" /> {booking.location}
                    </p>
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" /> Date: {booking.date}
                    </p>
                    <p className="flex items-center gap-1.5 font-medium text-foreground">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" /> Slot: {booking.timeSlot}
                    </p>
                  </div>

                  <p className="text-sm font-black text-primary pt-1">
                    Total: ৳{booking.totalPrice}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-2 border-t border-border mt-3 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                  ID: {booking._id.slice(-6)}
                </span>
                {booking.status === "Pending" ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={cancellingId === booking._id}
                    className="rounded-xl gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    <XCircle className="w-3.5 h-3.5" /> 
                    {cancellingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-muted-foreground italic">
                    {booking.status === "Cancelled" ? "Cancelled" : "Locked"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}