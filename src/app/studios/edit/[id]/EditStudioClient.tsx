"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-session";
import { API_BASE_URL } from "@/lib/api";

export default function EditStudioClient({ studioId }: { studioId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    hourlyRate: "",
    maxCapacity: "",
    location: "",
    image: "",
    overview: "",
    userName: "",
    userEmail: "",
  });

  useEffect(() => {
    if (!studioId) return;

    fetch(`${API_BASE_URL}/api/studios/${studioId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch studio data");
        return res.json();
      })
      .then((data) => {
        setFormData({
          title: data.title || "",
          category: data.category || "",
          hourlyRate: data.hourlyRate || data.price || "",
          maxCapacity: data.maxCapacity || data.capacity || 1,
          location: data.location || "",
          image: data.image || "",
          overview: data.overview || data.description || "",
          userName: data.userName || "Hurien Jannat",
          userEmail: data.userEmail || "hurienj51@gmail.com",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching studio for edit:", err);
        setLoading(false);
      });
  }, [studioId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    authFetch(`${API_BASE_URL}/api/studios/${studioId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.status === 401) {
          router.push(
            `/login?callbackUrl=${encodeURIComponent(`/studios/edit/${studioId}`)}`
          );
          throw new Error("401 Unauthorized");
        }
        if (!res.ok) throw new Error("Failed to update studio");
        return res.json();
      })
      .then(() => {
        toast.success("Studio updated successfully!");
        setTimeout(() => {
          router.push("/my-listings");
        }, 1500);
      })
      .catch((err) => {
        console.error("Update error:", err);
        toast.error("Failed to update studio. Please try again.");
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Loading studio data for editing...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-10 relative">
      <div className="mb-6">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Listings
        </Link>
        <h1 className="text-3xl font-black text-foreground mt-2">
          Update Studio Space
        </h1>
        <p className="text-xs text-muted-foreground">
          Modify your space details and update them in MongoDB.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              Studio Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              Category
            </label>
            <input
              type="text"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              Hourly Rate ($)
            </label>
            <input
              type="number"
              name="hourlyRate"
              required
              value={formData.hourlyRate}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-2">
              Max Capacity
            </label>
            <input
              type="number"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            required
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Overview / Description
          </label>
          <textarea
            name="overview"
            rows={4}
            value={formData.overview}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-2xl bg-background border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Host Information (Read-Only)
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
            <div>
              Name: <span className="font-bold text-foreground">{formData.userName}</span>
            </div>
            <div>
              Email: <span className="font-bold text-foreground">{formData.userEmail}</span>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full py-6 font-bold gap-2 text-sm bg-primary text-primary-foreground"
        >
          <Save className="w-4 h-4" />{" "}
          {isSubmitting ? "Updating Listing..." : "Update Studio Listing"}
        </Button>
      </form>
    </div>
  );
}