"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password");
      }

      toast.success("Successfully logged in!");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      console.error("Sign In Error:", err);
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8FAFC] flex flex-col items-center justify-center px-4 py-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xl">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Sign In
          </h1>
          <p className="text-sm font-medium text-neutral-500">
            Access your StudioSpace account.
          </p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full bg-neutral-50/50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-700 block uppercase tracking-wider">Password</label>
              <Link href="#" className="text-xs text-blue-600 hover:underline font-medium">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full bg-neutral-50/50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-neutral-900 text-white text-sm font-bold rounded-xl shadow-md hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200"></div>
          </div>
          <span className="relative bg-white px-3 text-xs text-neutral-400 font-semibold">
            Or continue with
          </span>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Google sign-in integration")}
          className="w-full flex items-center justify-center gap-2 py-3 px-3 border border-neutral-200 hover:border-neutral-300 rounded-xl bg-white text-neutral-900 transition cursor-pointer shadow-sm text-sm font-bold"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        <div className="text-center pt-6">
          <p className="text-xs font-medium text-neutral-500">
            Don't have an account?{" "}
            <Link href="/register" className="font-bold text-neutral-900 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}