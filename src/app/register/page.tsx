"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { User, Mail, Image as ImageIcon, Lock, ArrowRight } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const photoURL = formData.get("photoURL") as string || "https://i.ibb.co.com/4g951YK/avatar.png";
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // Password validation criteria
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const isMinLength = password.length >= 6;

    if (!hasUppercase || !hasLowercase || !isMinLength) {
      toast.error("Password must have at least 1 uppercase letter, 1 lowercase letter, and be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      
      // Sending request directly to your Express backend on port 8000
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, photoURL, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      console.error("SignUp Catch Error:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 py-8 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-neutral-200/80">
        <div className="text-center mb-6 space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-sm font-medium text-neutral-500">
            Sign up to list or book world-class creative spaces.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Photo URL
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="photoURL"
                type="url"
                placeholder="https://image-link.com/photo.jpg"
                className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
            <p className="text-[11px] text-neutral-400 mt-1">
              Must be 6+ chars with at least one uppercase and one lowercase letter.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-neutral-50/50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer text-sm flex items-center justify-center gap-2"
          >
            {loading ? "Creating Account..." : "Create Account"} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-neutral-900 hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition">
          ← Return to Home
        </Link>
      </div>
    </div>
  );
}