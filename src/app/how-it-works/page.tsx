"use client";

import Link from "next/link";
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CalendarCheck, 
  ArrowRight, 
  Camera, 
  Film, 
  Mic, 
  Music 
} from "lucide-react";
import HowBookingWorks from "@/components/home/HowBookingWorks";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const creatorTypes = [
    { name: "Photographers", icon: <Camera className="w-3.5 h-3.5 text-blue-500" /> },
    { name: "Filmmakers", icon: <Film className="w-3.5 h-3.5 text-pink-500" /> },
    { name: "Podcasters", icon: <Mic className="w-3.5 h-3.5 text-amber-500" /> },
    { name: "Musicians", icon: <Music className="w-3.5 h-3.5 text-purple-500" /> },
  ];

  const features = [
    {
      title: "Verified Hosts & Studios",
      description: "Every studio listed on StudioSpace is manually reviewed for quality audio/video equipment and clean specs.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Real-Time Availability",
      description: "No back-and-forth messaging. Check slot availability instantly and lock your production schedule without conflicts.",
      icon: <Zap className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "Transparent Hourly Rates",
      description: "Clear pricing with no hidden equipment fees. Pay strictly for the shoot hours you book with instant invoice generation.",
      icon: <CalendarCheck className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background">
      {/* 🚀 Redesigned Unique & Modern Hero Header */}
      <section className="relative overflow-hidden border-b border-border bg-card/40 py-20 sm:py-28">
        {/* Decorative Background Blur Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Simple & Transparent Process</span>
          </div>

          {/* Heading with Gradient Accent */}
          <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Everything you need to know about booking on{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              StudioSpace
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
            Discover how easy it is to reserve your dream creative workspace, book shoot hours, and produce your best work.
          </p>

          {/* Creator Category Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Tailored for:</span>
            {creatorTypes.map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-background border border-border shadow-xs text-xs font-semibold text-foreground hover:border-primary/50 transition-colors cursor-default"
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main 4-Step Interactive Section */}
      <HowBookingWorks />

      {/* Why Choose StudioSpace Feature Section */}
      <section className="border-t border-border bg-card/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Designed for Creators & Hosts
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              We eliminate booking friction so you can focus entirely on your creative output.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-border bg-background shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div className="p-3.5 w-fit rounded-2xl bg-muted mb-5 border border-border shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-14 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to start your next production?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-3">
              Explore hundreds of unique sound stages, cyc walls, and recording suites near you.
            </p>
          </div>
          <Button
            size="lg"
            className="relative z-10 rounded-full bg-white text-foreground hover:bg-white/90 font-bold px-8 py-6 text-sm shadow-lg group"
            asChild
          >
            <Link href="/studios" className="flex items-center gap-2">
              Explore Studios <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}