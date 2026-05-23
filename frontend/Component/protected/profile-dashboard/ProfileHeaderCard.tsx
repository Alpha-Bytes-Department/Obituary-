"use client";

import Image from "next/image";
import { PencilLine } from "lucide-react";

import type { DashboardUser } from "./types";

/**
 * Renders the dashboard profile summary card.
 *
 * @param {object} props - Component props.
 * @param {DashboardUser} props.user - The current user.
 * @returns {JSX.Element} The profile header card.
 */
export default function ProfileHeaderCard({ user }: { user: DashboardUser }) {
  return (
    <section className="overflow-hidden rounded-md border border-[#e5dfd7] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-[#dfd8cf] bg-[#f2eee8] shadow-sm sm:h-28 sm:w-28">
            <Image
              src={user.userImage}
              alt={`${user.firstName} ${user.lastName}`.trim()}
              fill
              className="object-cover"
              sizes="112px"
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

        <div className="relative overflow-hidden rounded-md border border-[#e4ddd4] bg-[#f8f4ef]">
          <Image
            src="/Source/Banner.jpg"
            alt="Funeral home cover"
            width={720}
            height={240}
            className="h-full w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
