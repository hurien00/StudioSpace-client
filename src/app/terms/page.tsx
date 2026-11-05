import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Use — StudioSpace",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-4">
        Terms of Use
      </h1>
      <p className="text-xs text-muted-foreground mt-1">Last updated: 2026</p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Using StudioSpace</h2>
          <p>
            StudioSpace connects creators with studio owners. You must provide
            accurate account details and use the platform only for lawful
            bookings of creative workspaces.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Listings and bookings</h2>
          <p>
            Hosts are responsible for the accuracy of their listings, including
            pricing, capacity and amenities. Bookings are requests until a host
            confirms them. Overlapping reservations for the same studio and time
            are automatically rejected.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Cancellations</h2>
          <p>
            Creators may cancel a pending or confirmed booking from My Bookings.
            Repeated late cancellations may limit access to the platform.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Content</h2>
          <p>
            You keep ownership of the photos and text you upload, and you grant
            StudioSpace permission to display them on the marketplace.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">5. Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a className="font-semibold text-foreground hover:underline" href="mailto:support@studiospace.app">
              support@studiospace.app
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
