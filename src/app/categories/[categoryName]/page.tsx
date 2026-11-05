"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Star, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate?: number;
  price?: number;
  location: string;
  image?: string;
  rating?: number;
}

interface PageProps {
  params: Promise<{ categoryName: string }>;
}

export default function CategoryStudiosPage({ params }: PageProps) {
  const [categoryName, setCategoryName] = useState<string>("");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((resolvedParams) => {
      const decoded = decodeURIComponent(resolvedParams.categoryName || "");
      setCategoryName(decoded);
    });
  }, [params]);

  useEffect(() => {
    if (!categoryName) return;

    fetch("http://localhost:8000/api/studios", {
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch studios");
        return res.json();
      })
      .then((data: Studio[]) => {
        if (Array.isArray(data)) {
          const filtered = data.filter(
            (s) => s.category?.toLowerCase() === categoryName.toLowerCase()
          );
          setStudios(filtered);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching category studios:", err);
        setLoading(false);
      });
  }, [categoryName]);

  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Loading {categoryName} studios...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <div className="border-b border-border pb-6">
        <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
          Category Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mt-2">
          {categoryName}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Explore all available creative spaces listed under {categoryName}.
        </p>
      </div>

      {studios.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Studios Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            There are currently no listings available under the {categoryName} category.
          </p>
          <Button className="rounded-full px-6 mt-2 cursor-pointer" asChild>
            <Link href="/studios">Explore All Studios</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <Link 
              key={studio._id} 
              href={`/studios/${studio._id}`}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full bg-muted overflow-hidden">
                  <Image
                    src={studio.image || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0"}
                    alt={studio.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-xs text-foreground shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {studio.rating || 4.9}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition">{studio.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" /> {studio.location}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-2 border-t border-border mt-3 flex items-center justify-between">
                <span className="text-sm font-black text-primary">
                  ৳{studio.hourlyRate ?? studio.price ?? 2000} <span className="text-xs text-muted-foreground font-normal">/ hr</span>
                </span>
                <span className="text-xs font-bold text-foreground underline">View Details</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}