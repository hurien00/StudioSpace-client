"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearSession, ensureAuthToken, saveUser } from "@/lib/auth-session";

const MAX_ATTEMPTS = 10;
const RETRY_DELAY_MS = 300;

/**
 * Landing page for the Google OAuth redirect.
 *
 * Better Auth has already created the session by the time the browser gets
 * here. This page mirrors the email/password flow: persist the local user,
 * exchange the session for the JWT used by the Express API, then redirect.
 */
export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Completing sign in...");

  useEffect(() => {
    let cancelled = false;

    const finishSignIn = async () => {
      const oauthError = searchParams.get("error");

      if (oauthError) {
        setStatus("Google sign-in failed. Redirecting...");
        toast.error("Google sign-in was cancelled or failed. Please try again.");
        router.replace("/login");
        return;
      }

      const rawRedirect = searchParams.get("redirect");
      const redirectTo =
        rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
          ? rawRedirect
          : "/";

      // The session cookie can take a moment to become readable after the
      // provider redirect, so poll briefly before declaring failure.
      let user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      } | null = null;

      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const { data } = await authClient.getSession();

        if (data?.user?.email) {
          user = data.user;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      }

      if (cancelled) return;

      if (!user?.email) {
        clearSession();
        setStatus("Could not complete sign in. Redirecting...");
        toast.error("Could not complete Google sign-in. Please try again.");
        router.replace("/login");
        return;
      }

      saveUser({
        name: user.name || user.email.split("@")[0],
        email: user.email,
        image: user.image || undefined,
      });

      const tokenReady = await ensureAuthToken();

      if (cancelled) return;

      if (!tokenReady) {
        clearSession();
        setStatus("Could not start a secure session. Redirecting...");
        toast.error("Could not start a secure session. Please try again.");
        router.replace("/login");
        return;
      }

      setStatus("Signed in. Redirecting...");
      toast.success("Successfully signed in with Google!");
      router.replace(redirectTo);
      router.refresh();
    };

    void finishSignIn();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-[85vh] bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-card rounded-3xl p-8 border border-border shadow-xl text-center space-y-4">
        <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <h1 className="text-xl font-extrabold text-foreground">
          Signing you in
        </h1>
        <p className="text-sm font-medium text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
