"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessScreen({
  payload,
}: {
  payload: any;
}) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-3xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-2xl border border-slate-200 bg-white px-8 py-10 text-center shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:px-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#e7efe4] text-[#7d9c74]">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
          Submission Received
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-[0.95rem]">
          Your obituary has been submitted for review. It will become public
          after admin approval.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-[0.95rem]">
          We&apos;ll send you an email notification once your memorial has been
          reviewed. This typically takes 24-48 hours.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/profile"
            className="inline-flex min-w-36 items-center justify-center rounded-md bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
          >
            View Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex min-w-36 items-center justify-center rounded-md border border-slate-200 bg-[#f7f4ee] px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
