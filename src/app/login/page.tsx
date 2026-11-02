import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center">
          <p className="text-neutral-500 animate-pulse text-sm font-bold">
            Loading login...
          </p>
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}