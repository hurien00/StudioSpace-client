import React from "react";
import Link from "next/link";
import { ShieldCheck, UserCheck, Zap, Headphones, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AssuranceItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const assurances: AssuranceItem[] = [
  {
    title: "Liability protection",
    description: "Damage and injury cover on every confirmed booking.",
    icon: <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />,
  },
  {
    title: "Verified profiles",
    description: "Hosts and creators confirm their identity before booking.",
    icon: <UserCheck className="w-6 h-6 text-amber-400 shrink-0" />,
  },
  {
    title: "Equipment safety",
    description: "Lighting and rigging are checked against our safety list.",
    icon: <Zap className="w-6 h-6 text-amber-400 shrink-0" />,
  },
  {
    title: "24/7 host support",
    description: "Real people answer when something goes wrong at 2 a.m.",
    icon: <Headphones className="w-6 h-6 text-amber-400 shrink-0" />,
  },
];

export default function HostGuarantee() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-8 sm:p-12 lg:p-16 text-white shadow-2xl overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Subtitle & Action Button */}
          <div className="lg:col-span-5 flex flex-col items-start justify-between">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white/10 text-pink-400 border border-white/10 mb-6 backdrop-blur-md">
                100% Peace of Mind
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.1] text-white">
                Host guarantee <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-white via-slate-200 to-pink-400 bg-clip-text text-transparent">
                  and creator support
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-5 leading-relaxed max-w-md">
                Every booking is covered, so hosts and creators can focus strictly on producing world-class work.
              </p>
            </div>

            <div className="mt-8 sm:mt-10">
              <Button
                size="lg"
                className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-extrabold px-8 py-6 text-sm shadow-lg hover:shadow-pink-500/25 transition-all group border-0"
                asChild
              >
                <Link href="/register" className="flex items-center gap-2">
                  Create a free account
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column: 2x2 Features Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {assurances.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md hover:bg-white/[0.06] transition-colors"
              >
                <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}