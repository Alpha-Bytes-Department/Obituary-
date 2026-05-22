"use client";

import Image from "next/image";
import React from "react";
import { FuneralAdviceArticle } from "./types";

/**
 * ArticlePreviewCard
 *
 * Displays a preview card for a `FuneralAdviceArticle` with image, label,
 * title, and summary. Intended for use within the FuneralAdviceSection layout.
 *
 * Props:
 * - `article`: the article data to render
 * - `onSelect`: callback invoked when the card is clicked
 */
export default function ArticlePreviewCard({
  article,
  onSelect,
}: {
  article: FuneralAdviceArticle;
  onSelect: (article: FuneralAdviceArticle) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(article)}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-[#d8c8b0] bg-white text-left shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.12)]"
    >
      <div className="relative aspect-4/3 flex-none overflow-hidden bg-[#e9e3d8]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.01]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3 border-t border-[#e7ddd1] p-5">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#bb8b37]">
          {article.label}
        </p>
        <h3 className="font-heading text-[1.45rem] sm:text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-[#284c73]">
          {article.title}
        </h3>
        <p className="font-sans text-[0.95rem] leading-7 text-slate-700">
          {article.summary}
        </p>
      </div>
    </button>
  );
}
