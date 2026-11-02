import { Suspense } from "react";
import MyBookingsClient from "./MyBookingsClient";

export default function MyBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[75vh] flex items-center justify-center">
          <p className="text-muted-foreground animate-pulse text-base font-semibold">
            Loading your bookings...
          </p>
        </div>
      }
    >
      <MyBookingsClient />
    </Suspense>
  );
}