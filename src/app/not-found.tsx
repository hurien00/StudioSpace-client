import Link from "next/link";
import { Camera, Home, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="relative mx-auto w-40 h-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-pink-500/20 blur-xl" />
          <div className="relative w-40 h-40 rounded-full border border-border bg-card flex items-center justify-center shadow-xl">
            <Camera className="w-16 h-16 text-indigo-500" />
            <Sparkles className="absolute top-6 right-7 w-6 h-6 text-pink-500" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-foreground text-background text-[10px] font-extrabold tracking-widest">
              404
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            This set has wrapped
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We could not find that page. The studio might have been removed, the
            link mistyped, or the scene moved to another stage.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button className="rounded-full px-6 gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" /> Return to Home
            </Link>
          </Button>
          <Button variant="outline" className="rounded-full px-6 gap-2" asChild>
            <Link href="/studios">
              <Search className="w-4 h-4" /> Explore Studios
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
