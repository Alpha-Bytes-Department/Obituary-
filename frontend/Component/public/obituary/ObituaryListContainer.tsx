import { mockObituaries } from "../../../lib/mockData";

import ObituaryCard from "./ObituaryCard";

/**
 * Renders the obituary listing page.
 *
 * @returns {JSX.Element} The obituary list container.
 */
export default function ObituaryListContainer() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
          Browse
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          All Obituaries
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockObituaries.map((o) => (
          <ObituaryCard key={o.id} item={o} />
        ))}
      </div>
    </section>
  );
}
