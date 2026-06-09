"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";
import Image from "next/image";
import { Plus, Pencil, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";

interface Ad {
  _id: string;
  adImageUrl: string;
  adLinkUrl: string;
  adTitle: string;
  adDescription: string;
  placementType: string;
  isActive: boolean;
}

const PLACEMENT_OPTIONS = [
  { value: "funeral_advice", label: "Funeral Advice Section (Home)" },
  { value: "featured", label: "Featured Memories (Home)" },
  { value: "special_row_1", label: "Find a Memorial — Row 1" },
  { value: "special_row_2", label: "Find a Memorial — Row 2" },
];

function normalizeUrl(url: string): string {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function AdsManagement() {
  const api = useAxios();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [adLinkUrl, setAdLinkUrl] = useState("");
  const [placementType, setPlacementType] = useState("funeral_advice");
  const [isActive, setIsActive] = useState(true);
  const [adImageFile, setAdImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const fetchAds = async () => {
    try {
      const res = await api.get("/ads");
      setAds(res.data.ads || res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAds(); }, [api]);

  const resetForm = () => {
    setAdTitle(""); setAdDescription(""); setAdLinkUrl("");
    setPlacementType("funeral_advice"); setIsActive(true);
    setAdImageFile(null); setPreviewUrl(null);
    setEditingAd(null); setIsCreating(false);
  };

  const openCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  const openEdit = (ad: Ad) => {
    setAdTitle(ad.adTitle);
    setAdDescription(ad.adDescription || "");
    setAdLinkUrl(ad.adLinkUrl);
    setPlacementType(ad.placementType);
    setIsActive(ad.isActive);
    setAdImageFile(null);
    setPreviewUrl(ad.adImageUrl || null);
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

  const handleToggleActive = async (ad: Ad) => {
    try {
      const formData = new FormData();
      formData.append("adTitle", ad.adTitle);
      formData.append("adDescription", ad.adDescription || "");
      formData.append("adLinkUrl", ad.adLinkUrl);
      formData.append("placementType", ad.placementType);
      formData.append("isActive", String(!ad.isActive));
      await api.put(`/ads/${ad._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      setAds((prev) => prev.map((a) => a._id === ad._id ? { ...a, isActive: !a.isActive } : a));
      toast.success(`Ad ${!ad.isActive ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to toggle ad status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("adTitle", adTitle);
      formData.append("adDescription", adDescription);
      formData.append("adLinkUrl", adLinkUrl);
      formData.append("placementType", placementType);
      formData.append("isActive", String(isActive));
      if (adImageFile) formData.append("adImage", adImageFile);

      if (editingAd) {
        await api.put(`/ads/${editingAd._id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Ad updated");
      } else {
        await api.post("/ads", formData, { headers: { "Content-Type": "multipart/form-data" } });
        toast.success("Ad created");
      }
      resetForm();
      fetchAds();
    } catch (error) {
      toast.error("Failed to save ad");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading ads...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-heading text-3xl font-semibold text-[#1e3a5f]">Ads Management</h1>
        {!isCreating && (
          <button onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#16314f]">
            <Plus className="h-4 w-4" /> New Ad
          </button>
        )}
      </div>

      {/* CREATE / EDIT FORM */}
      {isCreating && (
        <div className="mb-8 rounded-2xl border border-[#ece6dd] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-[#1e3a5f]">{editingAd ? "Edit Ad" : "Create New Ad"}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title *</label>
                <input required value={adTitle} onChange={(e) => setAdTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Link URL *</label>
                <input required value={adLinkUrl} onChange={(e) => setAdLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea value={adDescription} onChange={(e) => setAdDescription(e.target.value)} rows={2}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f] resize-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Placement</label>
                <select value={placementType} onChange={(e) => setPlacementType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#1e3a5f]">
                  {PLACEMENT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Image</label>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="rounded-lg border-2 border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition">
                    {adImageFile ? adImageFile.name : "Choose image..."}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setAdImageFile(file);
                      setPreviewUrl(file ? URL.createObjectURL(file) : (editingAd?.adImageUrl || null));
                    }} />
                  {previewUrl && (
                    <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-slate-200">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded" />
                Active (show on site)
              </label>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button type="button" onClick={resetForm}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving}
                className="rounded-lg bg-[#1e3a5f] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#16314f] disabled:opacity-60">
                {saving ? "Saving..." : editingAd ? "Update Ad" : "Create Ad"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADS GRID */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad) => (
          <div key={ad._id} className="flex flex-col overflow-hidden rounded-2xl border border-[#ece6dd] bg-white shadow-sm">
            {/* IMAGE */}
            <div className="relative h-44 w-full bg-slate-100">
              {ad.adImageUrl ? (
                <Image src={ad.adImageUrl} alt={ad.adTitle} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">No Image</div>
              )}
              <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${ad.isActive ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-600"}`}>
                {ad.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* CONTENT */}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-semibold text-[#1e3a5f] line-clamp-1">{ad.adTitle}</h3>
              {ad.adDescription && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 flex-1">{ad.adDescription}</p>
              )}
              {ad.adLinkUrl && (
                <a href={normalizeUrl(ad.adLinkUrl)} target="_blank" rel="noreferrer noopener"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <ExternalLink className="h-3 w-3" /> {ad.adLinkUrl}
                </a>
              )}

              {/* ACTIONS */}
              <div className="mt-4 flex items-center justify-between border-t border-[#ece6dd] pt-3">
                <button onClick={() => handleToggleActive(ad)} title={ad.isActive ? "Deactivate" : "Activate"}
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${ad.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {ad.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {ad.isActive ? "Active" : "Inactive"}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(ad)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs text-[#1e3a5f] transition hover:bg-slate-50">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(ad._id)}
                    className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs text-red-600 transition hover:bg-red-100">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {ads.length === 0 && !isCreating && (
          <div className="col-span-full py-16 text-center text-slate-400">
            <p className="text-lg">No ads yet.</p>
            <button onClick={openCreate} className="mt-3 text-sm text-[#1e3a5f] underline">Create your first ad</button>
          </div>
        )}
      </div>
    </div>
  );
}
