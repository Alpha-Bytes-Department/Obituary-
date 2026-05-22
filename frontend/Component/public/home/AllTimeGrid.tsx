"use client";

import type { ObituaryMock } from "../../../lib/mockData";

import ResponsiveCarousel from "./ResponsiveCarousel";

/**
 * Renders the all-time memorable obituary grid.
 *
 * @param {object} props - Component props.
 * @param {ObituaryMock[]} props.items - Obituaries to render.
 * @returns {JSX.Element} The memorable grid.
 */
export default function AllTimeGrid({ items }: { items: ObituaryMock[] }) {
  return (
    <div className="p-4 lg:p-5">
      <ResponsiveCarousel items={items} variant="memorable" />
    </div>
  );
}
