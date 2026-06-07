"use client";

import { PencilLine, User, Camera, Loader2, Building2 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useAxios } from "../../../context/AxiosProvider";
import { useAppContext } from "../../../context/AppContext";

import type { DashboardUser } from "./types";

/**
 * Renders the dashboard profile summary card.
 *
 * @param {object} props - Component props.
 * @param {DashboardUser} props.user - The current user.
 * @returns {JSX.Element} The profile header card.
 */
export default function ProfileHeaderCard({ user: initialUser }: { user: DashboardUser }) {
  const { setSession, accessToken, refreshToken } = useAppContext();
  const api = useAxios();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const user = initialUser; // Use the passed user which gets updated via context
  return (
    <section className="overflow-hidden rounded-md border  border-[#e5dfd7] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="group relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#dfd8cf] bg-[#f2eee8] shadow-sm sm:h-28 sm:w-28">
            {user.userImage && user.userImage !== "/Source/person.jpg" ? (
              <img
                src={user.userImage}
                alt={`${user.firstName} ${user.lastName}`.trim()}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-[#b0a79d]" />
            )}
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                try {
                  setIsUploading(true);
                  const formData = new FormData();
                  formData.append("profilePhoto", file);
                  
                  const res = await api.post("/profile/photo", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                  });
                  
                  setSession(
                    {
                      ...user,
                      userImage: res.data.user.profilePhotoUrl,
                    } as any,
                    accessToken as string,
                    refreshToken as string
                  );
                  toast.success("Profile photo updated successfully!");
                } catch (error) {
                  toast.error("Failed to upload profile photo");
                } finally {
                  setIsUploading(false);
                }
              }}
            />
          </div>

          <div className="space-y-1.5">
            <div className="">
              <h1 className="font-heading text-[1.75rem] leading-none tracking-[-0.03em] text-[#233a60] sm:text-[2.15rem]">
                {user.firstName} {user.lastName}
              </h1>
              
            </div>
            <p className="text-[0.92rem] text-[#7b7f87]">ID: {user.id}</p>
            <p className="text-[0.92rem] text-[#7b7f87]">{user.email}</p>
          </div>
        </div>

        <div className="relative flex items-center justify-center overflow-hidden rounded-md border border-[#e4ddd4] bg-[#f8f4ef] h-[240px] w-full sm:aspect-[16/9] sm:h-auto">
          {user.funeralHome?.logoImageUrl ? (
            <img
              src={user.funeralHome.logoImageUrl}
              alt="Funeral home cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#b0a79d]">
              <Building2 className="mb-2 h-16 w-16 opacity-50" />
              <span className="text-sm font-medium opacity-70">No Funeral Home Logo</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
