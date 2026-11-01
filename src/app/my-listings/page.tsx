import { Suspense } from "react";
import MyListingsClient from "./MyListingsClient";

export default function MyListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[75vh] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-base font-semibold">
            Loading your listings...
          </p>
        </div>
      }
    >
      <MyListingsClient />
    </Suspense>
  );
}