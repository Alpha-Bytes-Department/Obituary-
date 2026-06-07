"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";
import { useAppContext } from "../../../context/AppContext";
import { Building2, Pencil, X, Upload } from "lucide-react";

export default function ProfileFuneralHomeSection() {
  const { user, setSession, accessToken, refreshToken } = useAppContext();
  const api = useAxios();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.funeralHome?.name || "",
    address: user?.funeralHome?.address || "",
    phone: user?.funeralHome?.phone || "",
    email: user?.funeralHome?.email || "",
    website: user?.funeralHome?.website || "",
    description: user?.funeralHome?.description || "",
    MapLink: user?.funeralHome?.MapLink || "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      // Update text fields
      const res = await api.put("/profile", {
        funeralHome: formData,
      });

      let updatedUser = { ...user, funeralHome: res.data.funeralHome };

      // Update logo if selected
      if (logoFile) {
        const fileData = new FormData();
        fileData.append("funeralHomePhoto", logoFile);
        const photoRes = await api.post("/profile/photo", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        updatedUser = { ...updatedUser, funeralHome: photoRes.data.funeralHome };
      }

      setSession(updatedUser, accessToken as string, refreshToken as string);
      toast.success("Funeral Home details updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update funeral home");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-6 rounded-md border border-[#e5dfd7] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-[#233a60]" />
          <h2 className="font-heading text-xl font-semibold tracking-[-0.03em] text-[#233a60] sm:text-2xl">
            Funeral Home Details
          </h2>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-md border border-[#e5dfd7] bg-[#f8f4ef] px-3 py-1.5 text-sm font-medium text-[#233a60] transition hover:bg-[#eadecc]"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {user.funeralHome ? (
            <>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#7b7f87]">Name</p>
                <p className="text-[#2b2621]">{user.funeralHome.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#7b7f87]">Email</p>
                <p className="text-[#2b2621]">{user.funeralHome.email || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#7b7f87]">Phone</p>
                <p className="text-[#2b2621]">{user.funeralHome.phone || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#7b7f87]">Website</p>
                <p className="text-[#2b2621]">
                  {user.funeralHome.website ? (
                    <a href={user.funeralHome.website} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                      {user.funeralHome.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-[#7b7f87]">Address</p>
                <p className="text-[#2b2621]">{user.funeralHome.address || "N/A"}</p>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-sm font-medium text-[#7b7f87]">Description</p>
                <p className="text-[#2b2621]">{user.funeralHome.description || "N/A"}</p>
              </div>
            </>
          ) : (
            <p className="text-[#7b7f87] sm:col-span-2">No funeral home details added yet. Click edit to add them.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[#4a4743]">Logo Image (16:9 Aspect Ratio)</label>
            <div className="relative flex aspect-[16/9] w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-[#d2cbc2] bg-[#f8f4ef] transition-colors hover:bg-[#f2efe9]">
              {(logoPreview || user.funeralHome?.logoImageUrl) ? (
                <img
                  src={logoPreview || user.funeralHome?.logoImageUrl}
                  alt="Logo Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#9b9187]">
                  <Upload className="mb-2 h-6 w-6" />
                  <span className="text-sm">Click to upload logo</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4a4743]">Funeral Home Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="E.g. Serenity Funerals"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4a4743]">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="contact@serenity.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4a4743]">Phone</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4a4743]">Website</label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="https://serenity.com"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[#4a4743]">Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="123 Main St, City, State"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[#4a4743]">Google Maps Link</label>
            <input
              name="MapLink"
              value={formData.MapLink}
              onChange={handleChange}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-[#4a4743]">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-[#d2cbc2] px-3 py-2 text-[0.95rem] outline-none transition focus:border-[#a89c8d]"
              placeholder="Tell us about your funeral home..."
            />
          </div>

          <div className="sm:col-span-2 mt-2">
            <button
              disabled={isSubmitting}
              onClick={handleSave}
              className="rounded-md bg-[#233a60] px-5 py-2.5 text-[0.95rem] font-medium text-white transition hover:bg-[#1b2f4d] disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
