"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState, type FormEvent } from "react";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // Reading the clock during prerender is disallowed; update after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("newsletter-email");
    toast.success(
      `You're on the list${email ? ` — we'll email ${email}` : ""}. New studio drops every week.`
    );
    e.currentTarget.reset();
  };

  return (
    <footer className="w-full border-t border-border bg-background text-foreground transition-colors duration-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border">
          
          {/* Column 1: Brand & Mission Statement */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-flex">
              <Image
                src="/images/Icon.png"
                alt="StudioSpace Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-45"
              />
              <span className="text-xl font-extrabold tracking-tight font-sans">
                StudioSpace
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              We help creators find, book and host studio space with fair prices and no phone tag.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Quick links</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/studios" className="hover:text-foreground transition-colors">Explore Studios</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Popular categories</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/studios?category=Photo+Studio" className="hover:text-foreground transition-colors">Photo Studios</Link>
              </li>
              <li>
                <Link href="/studios?category=Podcast+Lounge" className="hover:text-foreground transition-colors">Podcast Rooms</Link>
              </li>
              <li>
                <Link href="/studios?category=Music+Suite" className="hover:text-foreground transition-colors">Music Suites</Link>
              </li>
              <li>
                <Link href="/studios?category=Workshop" className="hover:text-foreground transition-colors">Art Workshops</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social Links */}
          <div className="space-y-4 lg:col-span-1">
            <h3 className="text-sm font-semibold tracking-wider uppercase">Get new listings</h3>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                name="newsletter-email"
                type="email"
                placeholder="you@email.com"
                required
                className="rounded-full bg-background border-input text-sm"
              />
              <Button type="submit" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-6">
                Join
              </Button>
            </form>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              {/* X (Twitter) Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-accent transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Terms Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© {currentYear || "2026"} StudioSpace. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of use</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}