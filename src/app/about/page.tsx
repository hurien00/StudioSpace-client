"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  Sparkles, 
  Target, 
  ShieldCheck, 
  HeartHandshake, 
  ArrowRight,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  const stats = [
    { label: "Active Creative Spaces", value: "500+" },
    { label: "Successful Bookings", value: "12K+" },
    { label: "Verified Hosts", value: "350+" },
    { label: "Creator Community", value: "25K+" },
  ];

  const values = [
    {
      title: "Creator-First Approach",
      description: "We build features tailored to photographers, filmmakers, podcasters, and audio engineers to streamline production workflows.",
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
    },
    {
      title: "Transparent & Fair",
      description: "No hidden booking charges or surprise equipment fees. What you see is exactly what you pay per hourly shoot.",
      icon: <ShieldCheck className="w-6 h-6 text-indigo-500" />,
    },
    {
      title: "Vetted Production Standards",
      description: "Every studio listed is manually inspected to guarantee high-grade soundproofing, professional lighting, and safety.",
      icon: <Award className="w-6 h-6 text-amber-500" />,
    },
    {
      title: "Empowering Local Hosts",
      description: "We help studio owners unlock secondary revenue streams while giving creators access to premier production hubs.",
      icon: <HeartHandshake className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      {/* 🚀 Modern Hero Header Section */}
      <section className="relative overflow-hidden border-b border-border bg-card/40 py-20 sm:py-28">
        {/* Ambient Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-0 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 backdrop-blur-md shadow-xs">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            <span>Our Story & Mission</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Empowering creators to find their next{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              creative home
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mt-6 max-w-3xl mx-auto leading-relaxed">
            StudioSpace is the premier marketplace bridging independent creators with world-class production hubs, sound stages, cyc walls, and podcast lounges.
          </p>
        </div>
      </section>

      {/* 📊 Key Impact Metrics Stats Bar */}
      <section className="border-b border-border bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-card/50 border border-border/60">
                <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🎯 Mission & Vision Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-pink-500/10 text-pink-600">
              <Target className="w-3.5 h-3.5" />
              <span>Vision & Mission</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Reimagining studio rentals for the modern creative era.
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Finding high-quality production space used to require endless phone calls, unpredictable rate cards, and rigid contracts. We set out to replace friction with instant booking transparency.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Whether you are shooting an indie music video, hosting a podcast series, or executing a commercial photo session, StudioSpace provides instant access to verified environments tailored for production success.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-muted aspect-video md:aspect-square flex items-center justify-center group">
            <Image
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1200&auto=format&fit=crop"
              alt="Creative Studio Setup"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
              <div className="text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-pink-400">Verified Sound Stage</p>
                <p className="text-lg font-extrabold mt-1">High-end acoustically treated recording environments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💎 Core Values & Platform Pillars */}
      <section className="border-t border-border bg-card/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight">
              What sets StudioSpace apart
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Our fundamental pillars built to safeguard hosts and supercharge content creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl border border-border bg-background shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="p-3.5 w-fit rounded-2xl bg-muted mb-5 border border-border">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 sm:p-14 text-white overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to showcase your space or start a shoot?
            </h2>
            <p className="text-sm sm:text-base text-white/90 mt-3">
              Join thousands of content creators and studio hosts transforming production workflows today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 relative z-10">
            <Button
              size="lg"
              className="rounded-full bg-white text-foreground hover:bg-white/90 font-bold px-8 py-6 text-sm shadow-lg group"
              asChild
            >
              <Link href="/studios" className="flex items-center gap-2">
                Explore Studios <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}