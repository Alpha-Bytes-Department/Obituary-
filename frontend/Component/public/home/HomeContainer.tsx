/**
 * HomeContainer - server component that composes the public homepage.
 *
 * @returns {JSX.Element} The home container.
 */

import { Suspense } from "react";

import {
  allTimeMemorableObituaries,
  featuredTodayObituaries,
} from "@/lib/mockData";

import AllTimeGrid from "./AllTimeGrid";
import FeaturedGrid from "./FeaturedGrid";
import HeroSearch from "./HeroSearch";

/**
 * Renders the homepage hero and obituary highlight grids.
 *
 * @returns {JSX.Element} The homepage.
 */
export default function HomeContainer() {
  return (
    <main className="space-y-12">
      <section className="overflow-hidden rounded-3xl border border-black/5 bg-slate-950 px-6 py-12 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:px-10 lg:px-14">
        <div className="max-w-3xl space-y-5">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/70">
            Remember with clarity
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            A respectful memorial experience, built for search and sharing.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Browse featured obituaries, honor memorable lives, and keep the UI
            fast enough to feel immediate.
          </p>
          <Suspense
            fallback={
              <div className="h-14 w-full max-w-2xl rounded-full bg-white/10" />
            }
          >
            <HeroSearch />
          </Suspense>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Today&apos;s Featured
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Recently remembered
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-600">
            Curated mock content that simulates the production homepage without
            slowing down the first load.
          </p>
        </div>
        <FeaturedGrid items={featuredTodayObituaries} />
      </section>

      <section className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            All-Time Memorable
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Lives that shaped the community
          </h2>
        </div>
        <AllTimeGrid items={allTimeMemorableObituaries} />
      </section>
    </main>
  );
}
