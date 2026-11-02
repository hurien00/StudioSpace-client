"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Trash2, 
  Edit, 
  MapPin, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  PlusCircle,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredUser } from "@/lib/auth-session";

interface Studio {
  _id: string;
  title: string;
  category: string;
  hourlyRate?: number;
  price?: number;
  location: string;
  image?: string;
  userEmail?: string;
  ownerEmail?: string;
}

export default function MyListingsClient() {
  const router = useRouter();
  const [listings, setListings] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studioToDelete, setStudioToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchListings = (email: string) => {
    setLoading(true);
    fetch(`http://localhost:8000/api/studios/my-listings?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setListings(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching my listings:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser?.email) {
      setUserEmail(storedUser.email);
    } else {
      router.replace("/login?callbackUrl=/my-listings");
    }
  }, [router]);

  useEffect(() => {
    if (userEmail) fetchListings(userEmail);
  }, [userEmail]);

  const confirmDelete = (id: string) => {
    setStudioToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!studioToDelete) return;
    setIsDeleting(true);

    fetch(`http://localhost:8000/api/studios/${studioToDelete}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete studio");
        return res.json();
      })
      .then(() => {
        setListings((prev) => prev.filter((item) => item._id !== studioToDelete));
        setDeleteModalOpen(false);
        setStudioToDelete(null);
        setIsDeleting(false);
        
        // Success Toast Show
        setToastMessage("Studio deleted successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      })
      .catch((err) => {
        console.error("Delete error:", err);
        setIsDeleting(false);
      });
  };

  if (loading) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse text-sm font-bold">
          Loading your studio spaces...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-10 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500 text-white shadow-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">My Studio Listings</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Manage your uploaded spaces, update details, or remove from listings .
          </p>
        </div>
        <Button className="rounded-full gap-2 font-bold px-6" asChild>
          <Link href="/add-studio">
            <PlusCircle className="w-4 h-4" /> Add New Studio
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-muted text-muted-foreground rounded-full flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">No Listings Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            You haven't added any studio spaces yet under your account ({userEmail}).
          </p>
          <Button className="rounded-full px-6 mt-2" asChild>
            <Link href="/add-studio">Create Your First Listing</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((studio) => (
            <div 
              key={studio._id} 
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-muted">
                  <img 
                    src={studio.image || "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0"} 
                    alt={studio.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md text-foreground text-[10px] font-extrabold uppercase tracking-wider border border-border">
                    {studio.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-bold text-foreground line-clamp-1">{studio.title}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" /> {studio.location}
                  </p>
                  <p className="text-sm font-black text-primary pt-1">
                    ৳{studio.hourlyRate ?? studio.price ?? 2000} <span className="text-xs font-medium text-muted-foreground">/ hr</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-2 grid grid-cols-2 gap-3 border-t border-border mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl gap-1.5 text-xs font-bold"
                  asChild
                >
                  <Link href={`/studios/edit/${studio._id}`}>
                    <Edit className="w-3.5 h-3.5 text-blue-500" /> Update
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20"
                  onClick={() => confirmDelete(studio._id)}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-5 text-center">
            <button 
              onClick={() => setDeleteModalOpen(false)} 
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-muted text-muted-foreground transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Are you sure?</h3>
              <p className="text-xs text-muted-foreground">
                This action will permanently delete this studio listing from the MongoDB database. This cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button 
                variant="outline" 
                className="rounded-2xl py-5 font-bold"
                onClick={() => setDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                disabled={isDeleting}
                className="rounded-2xl py-5 font-bold bg-red-500 hover:bg-red-600 text-white"
                onClick={handleDelete}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}