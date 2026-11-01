import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react"; 
import Navbar from "@/components/ui/shared/navbar";
import Footer from "@/components/ui/shared/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace — Peer-to-Peer Creative Workspace & Production Studio Sharing Platform",
  description: "Discover, filter, and reserve top-tier creative workspaces, photography cyc walls, cinema sound stages, and music recording suites.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        
        <Suspense fallback={<div className="h-16 w-full bg-background" />}>
          <Navbar />
        </Suspense>

        <main className="grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}