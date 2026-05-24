"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export type SubmissionFlow = {
  familyTree: any[];
  mediaUpload: { celebrationPhotos: string[] };
};

export default function SuccessScreen({
  payload,
}: {
  payload: SubmissionFlow;
}) {
  const familyCount = payload.familyTree.length;
  const photoCount = payload.mediaUpload.celebrationPhotos.length;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-black/5 bg-white px-6 py-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:px-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e6efe5] text-[#6e8b69]">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950">
          Submission Received
        </h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Your obituary has been submitted for review. It will become public
          after admin approval.
        </p>
        <p className="mt-6 text-sm leading-7 text-slate-500">
          We&apos;ll send you an email notification once your memorial has been
          reviewed. This typically takes 24-48 hours.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Family Tree Members
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {familyCount}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Uploaded Photos
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950">
              {photoCount}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-full bg-[#274877] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1f3a60]"
          >
            View Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
