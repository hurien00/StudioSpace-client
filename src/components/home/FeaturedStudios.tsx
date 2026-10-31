"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Heart } from "lucide-react";

interface Studio {
  _id: string;
  image: string;
  category: string;
  title: string;
  location: string;
  price: number;
  rating: number;
}

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   
    fetch("http://localhost:8000/api/studios/featured")
      .then((res) => res.json())
      .then((data) => {
        setStudios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching featured studios:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-neutral-500 animate-pulse">Loading featured studios...</p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Featured studios
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          Top-rated and newest spaces. Book your next session now.
        </p>
      </div>

      {/* Studios Grid (3 columns on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {studios.map((studio) => (
          <div
            key={studio._id}
            className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            {/* Image & Badges Container */}
            <div className="relative h-56 w-full bg-neutral-100 overflow-hidden group">
              <img
                src={studio.image}
                alt={studio.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Category Badge (Top-Left) */}
              <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                {studio.category}
              </span>

              {/* Rating Badge (Top-Right) */}
              <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {studio.rating}
              </span>

              {/* Favorite Icon Button */}
              <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white text-pink-500 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Card Content */}
            <div className="p-5 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 line-clamp-1">
                  {studio.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                  📍 {studio.location}
                </p>
              </div>

              {/* Price & View Details CTA */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100">
                <div>
                  <span className="text-lg font-extrabold text-neutral-900">${studio.price}</span>
                  <span className="text-xs text-neutral-500 font-medium"> / hr</span>
                </div>

                <Link
                  href={`/studios/${studio._id}`}
                  className="px-4 py-2 rounded-full border border-neutral-300 hover:border-neutral-900 text-neutral-900 font-semibold text-xs transition-all hover:bg-neutral-900 hover:text-white"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Studios Button */}
      <div className="flex justify-center mt-10">
        <Link
          href="/studios"
          className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md hover:scale-105"
        >
          See all studios
        </Link>
      </div>
    </section>
  );
}