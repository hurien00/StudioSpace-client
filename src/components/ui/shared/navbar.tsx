"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, PlusCircle, List, Calendar, ChevronDown, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ui/shared/theme-toggle";
import { authClient } from "@/lib/auth-client";
import {
  AUTH_CHANGE_EVENT,
  clearAuthToken,
  clearSession,
  ensureAuthToken,
  getStoredUser,
  setAuthCookie,
} from "@/lib/auth-session";

interface User {
  name: string;
  email: string;
  image?: string;
  photoURL?: string;
}

interface NavbarProps {
  user?: User | null;
  onLogout?: () => void;
}

export default function Navbar({ user: propUser = null }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(propUser);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const tokenCheckedRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = getStoredUser();

      if (storedUser?.email) {
        setAuthCookie(storedUser.email);

        // Re-establish the HTTPOnly JWT cookie once per page load for users
        // who already had a Better Auth session before this was introduced.
        if (!tokenCheckedRef.current) {
          tokenCheckedRef.current = true;
          void ensureAuthToken();
        }
      }

      setCurrentUser(storedUser ?? propUser);
    };

    syncUser();

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [pathname, propUser]);

  const handleLogout = async () => {
    // Clear the local session immediately, then invalidate the Better Auth
    // session cookie/record in the background.
    clearSession();
    setCurrentUser(null);
    setIsProfileDropdownOpen(false);
    void clearAuthToken();
    void authClient.signOut().catch(() => undefined);
    router.push("/login");
    router.refresh();
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
  ];

  const getInitials = (name: string) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/images/Icon.png"
              alt="StudioSpace Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:rotate-45"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight text-foreground font-sans">
              StudioSpace
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-sm font-medium transition-colors hover:text-primary ${
                    isActive
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute left-0 -bottom-5 w-full h-[3px] bg-pink-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 h-10 px-2 rounded-full hover:bg-muted transition cursor-pointer outline-none border border-transparent hover:border-border"
                >
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={currentUser.image || currentUser.photoURL} alt={currentUser.name} />
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-bold text-foreground">{currentUser.name?.split(" ")[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-2.5 border-b border-border/60 mb-1">
                      <p className="text-sm font-bold text-foreground">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        href="/add-studio"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition"
                      >
                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Add New Studio</span>
                      </Link>
                      <Link
                        href="/my-listings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition"
                      >
                        <List className="h-4 w-4 text-muted-foreground" />
                        <span>My Studio Listings</span>
                      </Link>
                      <Link
                        href="/my-bookings"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-xl transition"
                      >
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>My Bookings</span>
                      </Link>
                    </div>

                    <div className="my-1 border-t border-border/60" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-red-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" className="rounded-full px-5" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="rounded-full px-5 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-border flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="flex items-center gap-3 py-2 bg-muted/50 p-3 rounded-2xl">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={currentUser.image || currentUser.photoURL} alt={currentUser.name} />
                    <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </div>
                <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-foreground flex items-center gap-2 hover:bg-muted rounded-xl">
                  <UserIcon className="h-4 w-4 text-muted-foreground" /> My Profile
                </Link>
                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-foreground flex items-center gap-2 hover:bg-muted rounded-xl">
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
                </Link>
                <Link href="/add-studio" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-foreground flex items-center gap-2 hover:bg-muted rounded-xl">
                  <PlusCircle className="h-4 w-4 text-muted-foreground" /> Add New Studio
                </Link>
                <Link href="/my-listings" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-foreground flex items-center gap-2 hover:bg-muted rounded-xl">
                  <List className="h-4 w-4 text-muted-foreground" /> My Studio Listings
                </Link>
                <Link href="/my-bookings" onClick={() => setIsMobileMenuOpen(false)} className="py-2.5 px-3 text-sm text-foreground flex items-center gap-2 hover:bg-muted rounded-xl">
                  <Calendar className="h-4 w-4 text-muted-foreground" /> My Bookings
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full mt-2 justify-start rounded-xl font-semibold bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" className="rounded-full w-full" asChild>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button className="rounded-full w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}