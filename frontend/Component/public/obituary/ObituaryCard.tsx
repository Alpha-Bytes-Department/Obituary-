import Link from "next/link";

import type { ObituaryMock } from "../../../lib/mockData";

interface ObituaryCardProps {
  item: ObituaryMock;
  variant?: "default" | "memorable";
}

/**
 * Renders a single obituary card.
 *
 * @param {ObituaryCardProps} props - Component props.
 * @returns {JSX.Element} The obituary card.
 */
export default function ObituaryCard({
  item,
  variant = "default",
}: ObituaryCardProps) {
  const accentClass =
    variant === "memorable"
      ? "from-amber-100 to-white"
      : "from-slate-100 to-white";

  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
      <div className={`h-44 bg-linear-to-br ${accentClass} p-4`}>
        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/60 bg-white/70 p-4 backdrop-blur">
          <span className="text-xs uppercase tracking-[0.28em] text-slate-500">
            {item.location.city}
          </span>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-950">
              {item.deceasedFirstName} {item.deceasedLastName}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{item.headline}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-slate-600">{item.excerpt}</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-[0.24em] text-slate-400">
            {item.dateOfDeath}
          </span>
          <Link
            href={`/obituary/${item.id}`}
            className="text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:decoration-slate-950"
          >
            View story
          </Link>
        </div>
      </div>
    </article>
  );
}
