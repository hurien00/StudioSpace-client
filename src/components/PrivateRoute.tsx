"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthUser, useIsClient } from "@/hooks/use-auth-user";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isClient = useIsClient();
  const user = useAuthUser();

  useEffect(() => {
    if (isClient && !user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isClient, user, router, pathname]);

  if (!isClient) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Checking authentication...
        </p>
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
