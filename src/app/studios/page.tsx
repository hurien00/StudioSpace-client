"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Search, MapPin } from "lucide-react";

interface Studio {
  _id: string;
  image: string;
  category: string;
  title: string;
  location: string;
  price?: number;
  hourlyRate?: number;
  rating?: number;
}

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/studios")
      .then((res) => res.json())
      .then((data) => {
        setStudios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching studios:", err);
        setLoading(false);
      });
  }, []);

  const filteredStudios = studios.filter((studio) =>
    studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    studio.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore Studios
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Discover and book creative spaces, sound stages, and photo studios by the hour.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Search by title, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-card text-sm focus:outline-none focus:border-primary shadow-sm transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-card rounded-2xl h-[380px] border border-border animate-pulse p-4 flex flex-col justify-between">
                <div className="w-full h-52 bg-muted rounded-xl" />
                <div className="space-y-2 py-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudios.map((studio) => {
              const displayRate = studio.hourlyRate ?? studio.price ?? 0;

              return (
                <div
                  key={studio._id}
                  className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-56 w-full bg-background overflow-hidden group">
                    <Image
                      src={studio.image}
                      alt={studio.title}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    <span className="absolute top-3 left-3 bg-card/90 backdrop-blur-md text-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {studio.category}
                    </span>

                    <span className="absolute top-3 right-3 bg-card/90 backdrop-blur-md text-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {studio.rating ?? 4.9}
                    </span>

                    <button className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-card text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-base font-bold line-clamp-1">
                        {studio.title}
                      </h3>
                      <p className="text-xs opacity-70 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 opacity-60" /> {studio.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/60">
                      <div>
                        <span className="text-lg font-extrabold">৳{displayRate}</span>
                        <span className="text-xs opacity-70 font-medium"> / hr</span>
                      </div>

                      <Link
                        href={`/studios/${studio._id}`}
                        className="px-4 py-2 rounded-full border border-border hover:border-foreground text-foreground font-semibold text-xs transition-all hover:bg-foreground hover:text-background"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border mt-6 shadow-sm">
            <p className="text-xl font-bold">No studios found</p>
            <p className="text-sm opacity-70 mt-1">Try searching with a different keyword or check back later.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all shadow-md"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </main>
  );
}