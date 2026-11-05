import Link from "next/link";
import { Camera, Film, Mic, Music, Wrench } from "lucide-react";

const CATEGORIES = [
  { name: "Photo Studio", icon: Camera, color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { name: "Film Stage", icon: Film, color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  { name: "Podcast Lounge", icon: Mic, color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { name: "Music Suite", icon: Music, color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { name: "Workshop", icon: Wrench, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
];

export default function StudioCategories() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Browse by Category</h2>
        <p className="text-xs text-muted-foreground mt-1">Select a creative space category to explore tailored listings.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.name}
              href={`/studios?category=${encodeURIComponent(cat.name)}`}
              className="p-6 rounded-3xl bg-card border border-border hover:border-primary/50 shadow-xs hover:shadow-md transition flex flex-col items-center text-center group cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-3 group-hover:scale-110 transition duration-300 ${cat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition">{cat.name}</h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}