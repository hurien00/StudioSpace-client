"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Users, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Heart, 
  Share2,
  X,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Studio {
  _id: string;
  title: string;
  category: string;
  price?: number;
  hourlyRate?: number;
  maxCapacity?: number;
  capacity?: number;
  location: string;
  image?: string;
  images?: string[];
  amenities?: string[];
  description?: string;
  overview?: string;
  userName?: string;
  userEmail?: string;
  rating?: number;
}

export default function StudioDetailClient({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [bookingDate, setBookingDate] = useState("");
  const [bookingHours, setBookingHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userEmail = "hurienj51@gmail.com";

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(false);

    fetch(`http://localhost:8000/api/studios/${studioId}`, {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch studio");
        return res.json();
      })
      .then((data: Studio) => {
        if (isMounted) {
          setStudio(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("MongoDB Fetch Error:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [studioId]);

  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-base font-semibold">
          Fetching studio details from database...
        </p>
      </div>
    );
  }

  if (error || !studio) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="p-8 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground">Studio Not Found</h2>
          <p className="text-sm text-muted-foreground">
            No studio listing was found matching ID: <span className="font-mono text-xs">{studioId}</span>
          </p>
          <Button className="rounded-full px-6" asChild>
            <Link href="/studios">Explore Available Studios</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mainImage = studio.image || (studio.images && studio.images[0]) || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0";
  const galleryImages = studio.images && studio.images.length > 0 
    ? studio.images 
    : [mainImage, mainImage, mainImage, mainImage];

  const rate = studio.hourlyRate ?? studio.price ?? 2000;
  const capacityValue = studio.maxCapacity ?? studio.capacity ?? 10;
  const descriptionText = studio.description || studio.overview || "No description provided for this studio listing.";
  const totalPrice = rate * bookingHours;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingPayload = {
      studioId: studio._id,
      studioTitle: studio.title,
      studioImage: mainImage,
      location: studio.location,
      date: bookingDate,
      timeSlot: `${bookingHours} Hours`,
      totalPrice: totalPrice,
      userEmail: userEmail,
    };

    fetch("http://localhost:8000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingPayload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create booking");
        return res.json();
      })
      .then(() => {
        setIsSubmitting(false);
        setIsBookingOpen(false);
        router.push("/my-bookings");
      })
      .catch((err) => {
        console.error("Booking error:", err);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="w-full min-h-screen bg-background pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to All Studios
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
            <Share2 className="w-3.5 h-3.5" /> Share
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs text-pink-500">
            <Heart className="w-3.5 h-3.5" /> Save
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              {studio.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-600 border border-amber-400/20">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {studio.rating || 4.9} 
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            {studio.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-pink-500 shrink-0" /> {studio.location}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] sm:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-border">
          <div 
            className="md:col-span-2 relative h-full bg-muted cursor-pointer group overflow-hidden"
            onClick={() => setSelectedImage(mainImage)}
          >
            <img src={mainImage} alt={studio.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
              Click to Expand
            </div>
          </div>
          <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4 h-full">
            {galleryImages.slice(1, 5).map((img, index) => (
              <div key={index} className="relative h-full bg-muted cursor-pointer group overflow-hidden" onClick={() => setSelectedImage(img)}>
                <img src={img} alt={`Studio image ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-3 gap-4 p-6 rounded-3xl bg-card border border-border text-center shadow-xs">
              <div className="flex flex-col items-center">
                <Users className="w-5 h-5 text-indigo-500 mb-1" />
                <span className="text-xs text-muted-foreground">Capacity</span>
                <span className="text-sm font-bold text-foreground mt-0.5">Up to {capacityValue} people</span>
              </div>
              <div className="flex flex-col items-center border-x border-border">
                <Clock className="w-5 h-5 text-pink-500 mb-1" />
                <span className="text-xs text-muted-foreground">Booking Mode</span>
                <span className="text-sm font-bold text-foreground mt-0.5">Hourly Rate</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-1" />
                <span className="text-xs text-muted-foreground">Protection</span>
                <span className="text-sm font-bold text-foreground mt-0.5">Host Guaranteed</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">About this workspace</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {descriptionText}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <h2 className="text-xl font-bold text-foreground">Featured Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {studio.amenities && studio.amenities.length > 0 ? (
                  studio.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border text-xs font-semibold text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground col-span-full">Standard studio equipment included.</p>
                )}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarFallback className="font-bold bg-indigo-500/10 text-indigo-600">
                      {studio.userName ? studio.userName.slice(0, 2).toUpperCase() : "HJ"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-bold text-foreground">Hosted by {studio.userName || "Hurien Jannat"}</h3>
                      <UserCheck className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-xs text-muted-foreground">{studio.userEmail || "hurienj51@gmail.com"}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full text-xs">Contact Host</Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
              <div className="flex items-baseline justify-between border-b border-border pb-4">
                <div>
                  <span className="text-2xl font-black text-foreground">৳{rate}</span>
                  <span className="text-xs text-muted-foreground font-medium"> / hr</span>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  Live Available
                </span>
              </div>
              <Button
                onClick={() => setIsBookingOpen(true)}
                className="w-full rounded-full py-6 font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white hover:opacity-95 shadow-md text-sm"
              >
                Book Workspace Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <button onClick={() => setIsBookingOpen(false)} className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground transition">
              <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-foreground">Reserve {studio.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">Select date and hours for booking.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Select Date</label>
                  <input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">Duration (Hours)</label>
                  <input type="number" min="1" max="12" value={bookingHours} onChange={(e) => setBookingHours(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>৳{rate} x {bookingHours} hours</span>
                    <span>৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between font-bold text-foreground text-sm pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">৳{totalPrice}</span>
                  </div>
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full py-6 font-bold bg-pink-500 hover:bg-pink-600 text-white">
                {isSubmitting ? "Confirming & Saving..." : "Confirm & Pay"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Preview" className="max-w-full max-h-[90vh] rounded-2xl object-contain" />
        </div>
      )}
    </div>
  );
}