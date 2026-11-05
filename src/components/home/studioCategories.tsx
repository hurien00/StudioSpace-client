"use client";

import Link from "next/link";
import Image from "next/image";
import { Camera, Film, Mic, Music, Palette } from "lucide-react";
import { toSlug } from "@/lib/utils";

interface CategoryItem {
  title: string;
  subtitle: string;
  categoryQuery: string;
  image: string;
  icon: React.ReactNode;
  gradient: string;
}

const categories: CategoryItem[] = [
  {
    title: "Photo Studios",
    subtitle: "Cyc walls, strobes",
    categoryQuery: "Photo Studio",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f",
    icon: <Camera className="w-5 h-5 text-white" />,
    gradient: "from-blue-600/80 via-blue-900/40 to-transparent",
  },
  {
    title: "Sound Stages",
    subtitle: "Film and video sets",
    categoryQuery: "Film Stage",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728",
    icon: <Film className="w-5 h-5 text-white" />,
    gradient: "from-pink-600/80 via-pink-900/40 to-transparent",
  },
  {
    title: "Podcast Rooms",
    subtitle: "Treated and ready",
    categoryQuery: "Podcast Lounge",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc",
    icon: <Mic className="w-5 h-5 text-white" />,
    gradient: "from-amber-600/80 via-amber-900/40 to-transparent",
  },
  {
    title: "Music Suites",
    subtitle: "Record and mix",
    categoryQuery: "Music Suite",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
    icon: <Music className="w-5 h-5 text-white" />,
    gradient: "from-purple-600/80 via-purple-900/40 to-transparent",
  },
  {
    title: "Art Workshops",
    subtitle: "Paint, print, build",
    categoryQuery: "Workshop",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
    icon: <Palette className="w-5 h-5 text-white" />,
    gradient: "from-emerald-600/80 via-emerald-900/40 to-transparent",
  },
];

export default function StudioCategories() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Browse by studio type
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick a category and we will open Explore Studios with the filter already applied.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {categories.map((item) => (
          <Link
            key={item.title}
           
            href={`/studios/category/${toSlug(item.categoryQuery)}`}
            className="group relative h-80 rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-end p-5"
          >
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-90 group-hover:opacity-95 transition-opacity duration-300`} />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
            </div>

            {/* Content & Icon */}
            <div className="relative z-10 flex flex-col items-start text-left">
              <div className="mb-3 p-2.5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-inner">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                {item.title}
              </h3>
              <p className="text-xs font-medium text-white/80 mt-0.5">
                {item.subtitle}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}