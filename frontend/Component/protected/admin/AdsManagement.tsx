"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";
import Image from "next/image";

interface Ad {
  _id: string;
  adImageUrl: string;
  adLinkUrl: string;
  adTitle: string;
  adDescription: string;
  placementType: string;
  isActive: boolean;
}

export default function AdsManagement() {
  const api = useAxios();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form State
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [adLinkUrl, setAdLinkUrl] = useState("");
  const [placementType, setPlacementType] = useState("funeral_advice");
  const [isActive, setIsActive] = useState(true);
  const [adImageFile, setAdImageFile] = useState<File | null>(null);

  const fetchAds = async () => {
    try {
      const res = await api.get("/ads");
      if (res.data.ads) {
        setAds(res.data.ads);
      } else if (res.data.data) {
        setAds(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [api]);

  const resetForm = () => {
    setAdTitle("");
    setAdDescription("");
    setAdLinkUrl("");
    setPlacementType("funeral_advice");
    setIsActive(true);
    setAdImageFile(null);
    setEditingAd(null);
    setIsCreating(false);
  };

  const openEdit = (ad: Ad) => {
    setAdTitle(ad.adTitle);
    setAdDescription(ad.adDescription || "");
    setAdLinkUrl(ad.adLinkUrl);
    setPlacementType(ad.placementType);
    setIsActive(ad.isActive);
    setAdImageFile(null);
    setEditingAd(ad);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await api.delete(`/ads/${id}`);
      setAds((prev) => prev.filter((a) => a._id !== id));
      toast.success("Ad deleted");
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("adTitle", adTitle);
      formData.append("adDescription", adDescription);
      formData.append("adLinkUrl", adLinkUrl);
      formData.append("placementType", placementType);
      formData.append("isActive", String(isActive));
      if (adImageFile) {
        formData.append("adImage", adImageFile);
      }

      if (editingAd) {
        await api.put(`/ads/${editingAd._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ad updated");
      } else {
        await api.post("/ads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Ad created");
      }
      resetForm();
      fetchAds();
    } catch (error) {
      toast.error("Failed to save ad");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading ads...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold text-[#1e3a5f]">
          Ads Management
        </h1>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm text-white transition hover:bg-[#16314f]"
          >
            Create New Ad
          </button>
        )}
      </div>

      {isCreating && (
        <div className="mb-8 rounded-xl border border-[#ece6dd] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-medium text-[#1e3a5f]">
            {editingAd ? "Edit Ad" : "Create Ad"}
          </h2>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2b2621]">Ad Title</label>
              <input
                required
                value={adTitle}
                onChange={(e) => setAdTitle(e.target.value)}
                className="w-full rounded-md border border-[#ddd6cd] px-3 py-2 outline-none focus:border-[#233f68]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2b2621]">Link URL</label>
              <input
                required
                value={adLinkUrl}
                onChange={(e) => setAdLinkUrl(e.target.value)}
                className="w-full rounded-md border border-[#ddd6cd] px-3 py-2 outline-none focus:border-[#233f68]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-[#2b2621]">Description (Optional)</label>
              <textarea
                value={adDescription}
                onChange={(e) => setAdDescription(e.target.value)}
                className="w-full rounded-md border border-[#ddd6cd] px-3 py-2 outline-none focus:border-[#233f68]"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2b2621]">Placement Type</label>
              <select
                value={placementType}
                onChange={(e) => setPlacementType(e.target.value)}
                className="w-full rounded-md border border-[#ddd6cd] px-3 py-2 outline-none focus:border-[#233f68]"
              >
                <option value="featured">Featured Memories (Home)</option>
                <option value="funeral_advice">Funeral Advice (Home)</option>
                <option value="special_row_1">Special Row 1 (Find a Memorial)</option>
                <option value="special_row_2">Special Row 2 (Find a Memorial)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#2b2621]">Ad Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAdImageFile(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-[#ddd6cd] px-3 py-1.5 outline-none focus:border-[#233f68]"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2 text-sm font-medium text-[#2b2621]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active
              </label>
            </div>
            
            <div className="flex gap-2 md:col-span-2 md:justify-end mt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-[#ece5dc] px-4 py-2 text-sm transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#1e3a5f] px-4 py-2 text-sm text-white transition hover:bg-[#16314f]"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <div key={ad._id} className="overflow-hidden rounded-xl border border-[#ece6dd] bg-white shadow-sm flex flex-col">
            <div className="relative h-48 w-full bg-slate-100">
              {ad.adImageUrl ? (
                <Image src={ad.adImageUrl} alt={ad.adTitle} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">No Image</div>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${ad.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {ad.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="inline-flex rounded-full bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                  {ad.placementType.replace(/_/g, " ")}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-semibold text-[#1e3a5f] line-clamp-1">{ad.adTitle}</h3>
              <p className="mt-1 text-xs text-[#626262] line-clamp-2 flex-1">{ad.adDescription || "No description"}</p>
              <a href={ad.adLinkUrl} target="_blank" rel="noreferrer" className="mt-2 text-xs text-blue-600 hover:underline line-clamp-1">
                {ad.adLinkUrl}
              </a>
              <div className="mt-4 flex gap-2 justify-end border-t border-[#ece6dd] pt-3">
                <button
                  onClick={() => openEdit(ad)}
                  className="rounded-md border border-[#ece5dc] px-3 py-1 text-xs font-medium text-[#1e3a5f] transition hover:bg-slate-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ad._id)}
                  className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {ads.length === 0 && !isCreating && (
          <div className="col-span-full py-12 text-center text-[#626262]">No ads found. Create one!</div>
        )}
      </div>
    </div>
  );
}
