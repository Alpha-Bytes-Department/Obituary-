"use client";

import Image from "next/image";
import React from "react";
import { SponsoredCard } from "./types";

/**
 * SponsoredCardView
 *
 * Renders an advertisement/sponsored card where the image covers the card and
 * the copy (title + description) is placed below on a dark underlay. The
 * label is intentionally omitted per design.
 *
 * Props:
 * - `card`: the `SponsoredCard` data to render
 */
export default function SponsoredCardView({ card }: { card: SponsoredCard }) {
  return (
    <article className="h-full relative overflow-hidden rounded-md border shadow-[0_14px_32px_rgba(15,23,42,0.09)] transition duration-500">
      <Image
        src={card.image}
        alt={card.title}
        fill
        className="object-cover transition duration-700 hover:scale-[1.02]"
      />

      <div className="absolute inset-x-0 bottom-0 px-5 py-6 sm:px-6 bg-linear-to-t from-[#0f1724]/90 via-[#0f1724]/60 to-transparent">
        <h3 className="font-heading text-[1.5rem] sm:text-[1.9rem] font-semibold leading-tight tracking-[-0.04em] text-[#e8c96b]">
          {card.title}
        </h3>
        <p className="mt-2 font-sans text-sm leading-6 text-white/85">
          {card.description}
        </p>
      </div>
    </article>
  );
}
