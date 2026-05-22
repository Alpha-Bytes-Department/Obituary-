"use client";

import React from "react";
import { FuneralAdviceArticle } from "./types";

/**
 * FaqRail
 *
 * Renders a vertical list of FAQ-style article links. Each item is a button
 * that calls `onSelect` with the full article payload.
 *
 * Props:
 * - `title`: section title
 * - `articles`: array of `FuneralAdviceArticle` to render
 * - `onSelect`: callback invoked with the selected article
 */
export default function FaqRail({
  title,
  articles,
  onSelect,
}: {
  title: string;
  articles: FuneralAdviceArticle[];
  onSelect: (article: FuneralAdviceArticle) => void;
}) {
  return (
    <div className="flex flex-col rounded-md px-0 py-0">
      <p className="mb-4 font-heading text-2xl font-bold tracking-[-0.02em] text-[#2a4d74]">
        {title}
      </p>
      <div className="space-y-0">
        {articles.slice(0, 4).map((article) => (
          <button
            key={article.id}
            type="button"
            onClick={() => onSelect(article)}
            className="group flex w-full items-start justify-between gap-4 border-b border-[#e4ddd3] py-4 text-left transition last:border-b-0"
          >
            <span className=" text-[1.02rem] leading-7 font-semibold tracking-[-0.015em] text-[#31343a] transition group-hover:text-[#284c73]">
              {article.title}
            </span>
            <span className="mt-1 shrink-0 text-[#7d8896] transition group-hover:translate-x-0.5 group-hover:text-[#284c73]">
              →
            </span>
          </button>
        ))}
      </div>

     
    </div>
  );
}
