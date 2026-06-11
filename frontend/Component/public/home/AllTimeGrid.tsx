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
  // console.log("Rendering AllTimeGrid with items:", items);
  return (
    <div className="p-4 lg:p-5">
     {items.length > 0 ? (
        <ResponsiveCarousel items={items} variant="memorable" />
      ) : (
        <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6">
          <p className="text-center text-lg font-medium text-gray-500">
            No memorable obituaries available.
          </p>
        </div>
      )}
    </div>
  );
}
