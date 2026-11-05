"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, Image as ImageIcon, Loader2, Users, MapPin, Tag } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";

export default function AddStudioPage() {
  const router = useRouter();
  const user = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      toast.error("Please enter a valid Image URL");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    const studioData = {
      title: formData.get("title"),
      category: formData.get("category"),
      hourlyRate: formData.get("hourlyRate"),
      securityDeposit: formData.get("securityDeposit"),
      maxCapacity: formData.get("maxCapacity"),
      location: formData.get("location"),
      image: imageUrl,
      amenities: formData.get("amenities")?.toString().split(",").map(item => item.trim()).filter(Boolean) || [],
      overview: formData.get("overview"),
      userName: user?.name || "Anonymous",
      userEmail: user?.email || "unknown@example.com",
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/studios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studioData),
        credentials: "include",
      });

      if (res.status === 401) {
        toast.error("Session expired or unauthorized. Please log in again.");
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add studio");
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (err) {
      console.error("Add studio error:", err);
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 text-base-content py-10 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-3xl mx-auto bg-base-100 rounded-3xl p-8 border border-base-300 shadow-xl">
        <div className="mb-8 border-b border-base-300 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-indigo-500" /> Add New Studio
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Fill in the details below to list your creative space on StudioSpace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">Studio Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Neon Horizon Film Stage"
                required
                className="w-full bg-base-200 border border-base-300 rounded-xl px-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">Category</label>
              <select
                name="category"
                required
                className="w-full bg-base-200 border border-base-300 rounded-xl px-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
              >
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Stage">Film Stage</option>
                <option value="Podcast Lounge">Podcast Lounge</option>
                <option value="Music Suite">Music Suite</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">Hourly Rate TK</label>
              <div className="relative">
                <input
                  name="hourlyRate"
                  type="number"
                  placeholder="50"
                  required
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">Security Deposit TK</label>
              <div className="relative">
                <input
                  name="securityDeposit"
                  type="number"
                  placeholder="100"
                  required
                  className="w-full bg-base-200 border border-base-300 rounded-xl px-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider opacity-80">Max Capacity</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
                <input
                  name="maxCapacity"
                  type="number"
                  placeholder="20"
                  required
                  className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-80">Location / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                name="location"
                type="text"
                placeholder="e.g. 124 Creative Ave, Downtown, New York"
                required
                className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-80">Studio Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewFailed(false);
                }}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
              />
            </div>
            {imageUrl && !previewFailed && (
              <div className="mt-3 relative w-full h-48 rounded-2xl overflow-hidden border border-base-300 bg-base-200">
                <Image
                  src={imageUrl}
                  alt="Studio Preview"
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  onError={() => setPreviewFailed(true)}
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-80">Amenities (Comma separated)</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                name="amenities"
                type="text"
                placeholder="Wi-Fi, 4K Lighting, Makeup Room, AC, Soundproof"
                className="w-full bg-base-200 border border-base-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider opacity-80">Detailed Overview</label>
            <textarea
              name="overview"
              rows={4}
              placeholder="Describe your studio features, equipment included, rules, etc."
              required
              className="w-full bg-base-200 border border-base-300 rounded-xl p-4 text-sm font-semibold text-base-content focus:outline-none focus:border-primary transition"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200 p-4 rounded-2xl border border-base-300">
            <div>
              <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider block">Logged In Owner Name</label>
              <input
                type="text"
                readOnly
                value={user?.name || "Loading..."}
                className="w-full bg-transparent text-sm font-bold text-base-content focus:outline-none cursor-not-allowed mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold opacity-60 uppercase tracking-wider block">Logged In Owner Email</label>
              <input
                type="text"
                readOnly
                value={user?.email || "Loading..."}
                className="w-full bg-transparent text-sm font-bold text-base-content focus:outline-none cursor-not-allowed mt-0.5"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-content text-sm font-bold rounded-2xl shadow-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Studio Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}