import type { ObituaryMock } from "@/lib/mockData";

import ObituaryCard from "../obituary/ObituaryCard";

/**
 * Renders the all-time memorable obituary grid.
 *
 * @param {object} props - Component props.
 * @param {ObituaryMock[]} props.items - Obituaries to render.
 * @returns {JSX.Element} The memorable grid.
 */
export default function AllTimeGrid({ items }: { items: ObituaryMock[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ObituaryCard key={item.id} item={item} variant="memorable" />
      ))}
    </div>
  );
}
