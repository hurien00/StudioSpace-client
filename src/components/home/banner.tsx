"use client";

import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useIsClient } from "@/hooks/use-auth-user";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Banner() {
  const mounted = useIsClient();

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=1920&auto=format&fit=crop",
      title: "Find the room your next shoot deserves.",
      subtitle: "Cyc walls, sound stages and edit suites from local hosts, booked by the hour with the price shown up front.",
      primaryText: "Explore Studios",
      primaryLink: "/studios",
      secondaryText: "Host Your Space",
      secondaryLink: "/studios",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1920&auto=format&fit=crop",
      title: "Got an empty room? Put it to work.",
      subtitle: "List your studio, set your hourly rate and approve bookings from one dashboard.",
      primaryText: "Host Your Space",
      primaryLink: "/studios",
      secondaryText: "Explore Studios",
      secondaryLink: "/studios",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1920&auto=format&fit=crop",
      title: "Professional sound & music suites.",
      subtitle: "Acoustically treated rooms equipped with top-tier gear for your recording sessions.",
      primaryText: "Explore Studios",
      primaryLink: "/studios",
      secondaryText: "Host Your Space",
      secondaryLink: "/studios",
    },
  ];

  if (!mounted) {
    return (
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="w-full h-[420px] xs:h-[460px] sm:h-[520px] md:h-[540px] lg:h-[560px] bg-neutral-900 rounded-2xl sm:rounded-3xl animate-pulse" />
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Banner Slider Card */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-neutral-950 [&_.swiper-pagination]:bottom-4 [&_.swiper-pagination]:sm:bottom-6 [&_.swiper-pagination]:right-4 [&_.swiper-pagination]:sm:right-8 [&_.swiper-pagination]:left-auto [&_.swiper-pagination]:w-auto [&_.swiper-pagination]:flex [&_.swiper-pagination]:gap-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:sm:w-2 [&_.swiper-pagination-bullet]:sm:h-2 [&_.swiper-pagination-bullet]:bg-white/50 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet-active]:w-4 [&_.swiper-pagination-bullet-active]:sm:w-6 [&_.swiper-pagination-bullet-active]:bg-white">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect={"fade"}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          className="w-full h-[420px] xs:h-[460px] sm:h-[520px] md:h-[540px] lg:h-[560px]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                style={{ backgroundImage: `url(${slide.image})` }}
              />

              {/* Responsive Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent md:bg-gradient-to-r md:from-blue-950/95 md:via-blue-900/70 md:to-transparent md:w-3/4" />
              <div className="absolute inset-0 bg-black/20" />

              {/* Content Container */}
              <div className="relative z-10 flex flex-col justify-end md:justify-center h-full max-w-2xl px-5 sm:px-10 lg:px-16 pb-12 md:pb-0 space-y-3 sm:space-y-5 text-white">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-snug drop-shadow-md">
                  {slide.title}
                </h1>
                
                <p className="text-xs sm:text-sm md:text-base text-gray-200/90 max-w-md sm:max-w-lg leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                  {slide.subtitle}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-row items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <Link
                    href={slide.primaryLink}
                    className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95 text-center whitespace-nowrap"
                  >
                    {slide.primaryText}
                  </Link>

                  <Link
                    href={slide.secondaryLink}
                    className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-white/80 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all backdrop-blur-sm text-center whitespace-nowrap"
                  >
                    {slide.secondaryText}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stats Section (Below Banner) */}
      <div className="mt-6 px-4 sm:px-6 flex flex-wrap items-center justify-between sm:justify-start gap-6 sm:gap-16 text-foreground">
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">1,200+</span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">studios listed</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">4.8</span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">average rating</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold text-foreground tracking-tight">$18</span>
          <span className="text-xs sm:text-sm text-muted-foreground font-medium">average starting rate per hour</span>
        </div>
      </div>
    </section>
  );
}