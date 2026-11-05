import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-background flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-sm font-bold">
            Completing sign in...
          </p>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
