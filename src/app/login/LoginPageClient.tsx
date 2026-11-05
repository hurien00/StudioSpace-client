"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import GoogleAuthButton from "@/components/auth/google-auth-button";
import {
  clearSession,
  ensureAuthToken,
  getStoredUser,
  saveUser,
  setAuthCookie,
} from "@/lib/auth-session";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawRedirect = searchParams.get("callbackUrl") ?? searchParams.get("redirect");
  const redirectTo = rawRedirect && rawRedirect.startsWith("/") ? rawRedirect : "/";

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser) return;

    setAuthCookie(storedUser.email || "authenticated");

    let cancelled = false;

    // Refresh the HTTPOnly JWT cookie before entering a private page. If the
    // Better Auth session has expired, clear the stale local session instead
    // of sending the user into pages whose API calls would return 401.
    void ensureAuthToken().then((ok) => {
      if (cancelled) return;

      if (!ok) {
        clearSession();
        return;
      }

      router.replace(redirectTo);
    });

    return () => {
      cancelled = true;
    };
  }, [router, redirectTo]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const authUser = data?.user;
      saveUser({
        name: authUser?.name ?? email.split("@")[0],
        email: authUser?.email ?? email,
        image: authUser?.image ?? undefined,
      });

      // Establish the HTTPOnly JWT cookie used by the Express API.
      const tokenReady = await ensureAuthToken();
      if (!tokenReady) {
        clearSession();
        toast.error("Could not start a secure session. Please try again.");
        setLoading(false);
        return;
      }

      setAuthCookie(email);
      toast.success("Successfully logged in!");
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Sign In Error:", err);
      toast.error(err instanceof Error ? err.message : "Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-background flex flex-col items-center justify-center px-4 py-8 font-sans">
      <div className="max-w-md w-full bg-card rounded-3xl p-8 border border-border shadow-xl">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Sign In
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Access your StudioSpace account.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground block uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:border-ring transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground block uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={() =>
                  toast.info(
                    "Password reset is disabled in this demo. Contact support@studiospace.app and we will help you back in."
                  )
                }
                className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-muted/40 border border-border rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-foreground focus:outline-none focus:border-ring transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-card px-3 text-xs text-muted-foreground font-semibold">
            Or continue with
          </span>
        </div>

        <GoogleAuthButton
          callbackPath={`/auth/callback?redirect=${encodeURIComponent(redirectTo)}`}
        />

        <div className="text-center pt-6">
          <p className="text-xs font-medium text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}