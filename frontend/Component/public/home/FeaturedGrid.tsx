import type { ObituaryMock } from "../../../lib/mockData";

import ObituaryCard from "../obituary/ObituaryCard";

/**
 * Renders the featured obituary grid.
 *
 * @param {object} props - Component props.
 * @param {ObituaryMock[]} props.items - Obituaries to render.
 * @returns {JSX.Element} The featured grid.
 */
export default function FeaturedGrid({ items }: { items: ObituaryMock[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ObituaryCard key={item.id} item={item} />
      ))}
    </div>
  );
}
