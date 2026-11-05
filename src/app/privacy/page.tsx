import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — StudioSpace",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-4">
        Privacy Policy
      </h1>
      <p className="text-xs text-muted-foreground mt-1">Last updated: 2026</p>

      <div className="mt-8 space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">What we collect</h2>
          <p>
            Account name, email, profile photo URL, the studios you list, and the
            bookings you create. Google sign-in shares your name, email and
            profile photo with us.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">How we use it</h2>
          <p>
            To authenticate you, show your listings to you, match bookings to
            your email, and keep the marketplace safe. We do not sell personal
            data.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Where data lives</h2>
          <p>
            Account, studio and booking records are stored in MongoDB. Session
            tokens are kept in HTTPOnly cookies and short-lived bearer tokens,
            never in localStorage.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">Your choices</h2>
          <p>
            You can delete your listings from My Studio Listings and cancel
            bookings from My Bookings. To delete your account, email{" "}
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
