"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Replace with your actual auth validation logic (e.g., AuthContext, cookie, or localStorage)
    const user = localStorage.getItem("user"); 

    if (!user) {
      setIsAuthenticated(false);
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, pathname]);

  if (isAuthenticated === null) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Checking authentication...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}