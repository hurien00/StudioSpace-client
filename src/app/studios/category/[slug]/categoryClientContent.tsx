"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Heart, MapPin, ArrowLeft } from "lucide-react";
import { fromSlug } from "@/lib/utils";

interface Studio {
  _id: string;
  image: string;
  category: string;
  title: string;
  location: string;
  hourlyRate?: number;
  price?: number;
  rating?: number;
}

export default function CategoryClientContent({ slug }: { slug: string }) {
  const categoryName = fromSlug(slug);

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    fetch("http://localhost:8000/api/studios", {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data: Studio[]) => {
        if (!isMounted) return;
        const filtered = data.filter(
          (studio) =>
            studio.category.toLowerCase() === categoryName.toLowerCase()
        );
        setStudios(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching studios:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryName]);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground animate-pulse text-lg">
          Loading {categoryName} studios...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Navigation */}
      <Link
        href="/studios"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Studios
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          {categoryName}s
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Showing all available listings under {categoryName} category.
        </p>
      </div>

      {/* Empty State */}
      {studios.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border">
          <p className="text-lg font-bold text-foreground">
            No {categoryName} studios found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back later or explore other categories.
          </p>
          <Link
            href="/studios"
            className="inline-block mt-5 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-xs transition"
          >
            Explore All Studios
          </Link>
        </div>
      ) : (
        /* Studios Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => {
            const displayPrice = studio.hourlyRate ?? studio.price ?? 0;
            const displayRating = studio.rating ?? 4.8;

            return (
              <div
                key={studio._id}
                className="bg-card text-card-foreground rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative h-56 w-full bg-muted overflow-hidden group">
                  <img
                    src={studio.image}
                    alt={studio.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    {studio.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-background/90 text-foreground backdrop-blur-md text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {displayRating}
                  </span>
                  <button className="absolute bottom-3 right-3 bg-background/90 hover:bg-background text-pink-500 backdrop-blur-md p-2 rounded-full shadow-sm transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-base font-bold text-foreground line-clamp-1">
                      {studio.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> {studio.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div>
                      <span className="text-lg font-extrabold text-foreground">
                        ৳{displayPrice}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {" "}
                        / hr
                      </span>
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
      )}
    </div>
  );
}