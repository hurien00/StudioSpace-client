import React from "react";
import { Search, CalendarCheck, Zap, Clapperboard } from "lucide-react";

interface StepItem {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  badgeColor: string;
}

const steps: StepItem[] = [
  {
    step: "01",
    title: "Discover Spaces",
    description: "Filter by type, price and city, then check live availability on interactive maps.",
    icon: <Search className="w-6 h-6 text-blue-500" />,
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    badgeColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
  {
    step: "02",
    title: "Select Shoot Hours",
    description: "Choose a precise date and time slot. Clashing or confirmed slots are blocked automatically.",
    icon: <CalendarCheck className="w-6 h-6 text-pink-500" />,
    gradient: "from-pink-500/10 via-rose-500/5 to-transparent",
    badgeColor: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  },
  {
    step: "03",
    title: "Book Instantly",
    description: "Send your reservation request and track real-time approval status securely in My Bookings.",
    icon: <Zap className="w-6 h-6 text-amber-500" />,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    step: "04",
    title: "Create & Produce",
    description: "Arrive at the studio, set up your gear, and shoot your masterpiece. Download invoices instantly.",
    icon: <Clapperboard className="w-6 h-6 text-emerald-500" />,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    badgeColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
];

export default function HowBookingWorks() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary mb-3">
          Seamless Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          How booking works
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mt-3">
          From finding the ultimate creative set to rolling cameras in just four simple steps.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item) => (
          <div
            key={item.step}
            className="group relative rounded-3xl p-8 bg-card border border-border shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between overflow-hidden"
          >
            {/* Background Glow Effect */}
            <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            {/* Top Row: Icon & Step Number */}
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div className="p-3.5 rounded-2xl bg-background border border-border shadow-inner group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${item.badgeColor}`}>
                STEP {item.step}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}