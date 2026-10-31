"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PlusCircle, Image as ImageIcon, Loader2, DollarSign, Users, MapPin, Tag, FileText } from "lucide-react";

export default function AddStudioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

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
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add studio");
      }

      toast.success("Studio added successfully!");
      router.push("/my-listings");
      router.refresh();
    } catch (err: any) {
      console.error("Add studio error:", err);
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xl">
        <div className="mb-8 border-b border-neutral-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <PlusCircle className="w-8 h-8 text-indigo-600" /> Add New Studio
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Fill in the details below to list your creative space on StudioSpace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Studio Title</label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Neon Horizon Film Stage"
                required
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Category</label>
              <select
                name="category"
                required
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              >
                <option value="Photo Studio">Photo Studio</option>
                <option value="Film Stage">Film Stage</option>
                <option value="Podcast Lounge">Podcast Lounge</option>
                <option value="Music Suite">Music Suite</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
          </div>

          {/* Rates & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Hourly Rate TK </label>
              <div className="relative">
                <input
                  name="hourlyRate"
                  type="number"
                  placeholder="50"
                  required
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Security Deposit TK</label>
              <div className="relative">
                <input
                  name="securityDeposit"
                  type="number"
                  placeholder="100"
                  required
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Max Capacity</label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="maxCapacity"
                  type="number"
                  placeholder="20"
                  required
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Location / Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="location"
                type="text"
                placeholder="e.g. 124 Creative Ave, Downtown, New York"
                required
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          {/* Image URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Studio Image URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                required
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
            {/* Live Image Preview */}
            {imageUrl && (
              <div className="mt-3 relative w-full h-48 rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100">
                <img
                  src={imageUrl}
                  alt="Studio Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Amenities (Comma separated)</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                name="amenities"
                type="text"
                placeholder="Wi-Fi, 4K Lighting, Makeup Room, AC, Soundproof"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
              />
            </div>
          </div>

          {/* Detailed Overview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Detailed Overview</label>
            <textarea
              name="overview"
              rows={4}
              placeholder="Describe your studio features, equipment included, rules, etc."
              required
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-4 text-sm font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 transition"
            ></textarea>
          </div>

          {/* Read-only User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-100 p-4 rounded-2xl border border-neutral-200">
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Logged In Owner Name</label>
              <input
                type="text"
                readOnly
                value={user?.name || "Loading..."}
                className="w-full bg-transparent text-sm font-bold text-neutral-900 focus:outline-none cursor-not-allowed mt-0.5"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Logged In Owner Email</label>
              <input
                type="text"
                readOnly
                value={user?.email || "Loading..."}
                className="w-full bg-transparent text-sm font-bold text-neutral-900 focus:outline-none cursor-not-allowed mt-0.5"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-neutral-900 text-white text-sm font-bold rounded-2xl shadow-lg hover:bg-neutral-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Studio Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}