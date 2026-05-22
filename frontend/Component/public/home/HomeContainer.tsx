import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import {
  allTimeMemorableObituaries,
  featuredTodayObituaries,
} from "../../../lib/mockData";

import AllTimeGrid from "./AllTimeGrid";
import FeaturedGrid from "./FeaturedGrid";
import HeroSearch from "./HeroSearch";
import FuneralAdviceSection from "./FuneralAdviceSection";
import { testimonials } from "./data";

export default function HomeContainer() {
  return (
    <main className="space-y-16">
      <section className="overflow-hidden rounded-[2rem] border border-black/5 bg-[#111827] shadow-[0_30px_90px_rgba(15,23,42,0.22)]">
        <div className="relative min-h-128 sm:min-h-152">
          <Image
            src="/source/Banner.jpg"
            alt="Memorial hero background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,15,20,0.55)_0%,rgba(11,15,20,0.42)_35%,rgba(11,15,20,0.6)_100%)]" />

          <div className="relative z-10 flex min-h-128 flex-col items-center justify-center px-6 py-14 text-center text-white sm:min-h-152 sm:px-10">
            <div className="max-w-5xl space-y-6 font-sans">
              <h1 className="text-4xl font-heading font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[4.1rem]">
                Honor a Life. Preserve a Legacy.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-white/82 sm:text-xl">
                Create a beautiful online memorial where family and friends can
                share memories, photos, and tributes.
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/profile/create"
                  className="rounded-md bg-[#1e3a5f] px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#16314f]"
                >
                  Create a Memorial
                </Link>
                <Link
                  href="/obituary"
                  className="rounded-md border border-white/70 bg-white px-5 py-3 text-sm font-medium text-[#1e3a5f] transition hover:bg-white/90"
                >
                  Find a Memorial
                </Link>
              </div>

              <div className="mx-auto mt-8 max-w-3xl rounded-2xl bg-[rgba(197,149,22,0.78)] px-4 py-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)] sm:px-5">
                <Suspense
                  fallback={
                    <div className="h-14 w-full rounded-2xl bg-white/20" />
                  }
                >
                  <HeroSearch />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#132855] sm:text-[2.15rem]">
              Today&apos;s Featured Memories
            </h2>
            <p className=" text-lg font-thin text-slate-700/90  ">
              See remarkable individuals who&apos;ve died recently and left a
              lasting legacy.{" "}
            </p>
          </div>
        </div>
        <FeaturedGrid items={featuredTodayObituaries} />
      </section>

      <section className="space-y-5">
        <div>
          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#132855] sm:text-[2.15rem]">
            Lives Remembered Forever
          </h2>
          <p className=" text-lg font-thin text-slate-700/90  ">
            Their loved ones created beautiful obituaries on Legacy to keep
            their life stories alive.
          </p>
        </div>
        <AllTimeGrid items={allTimeMemorableObituaries} />
      </section>

      <FuneralAdviceSection />
      <section className="rounded-sm bg-[#d8ad59] px-6 py-12 sm:px-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#132855]">
            Trusted by Families Nationwide
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-700/80">
            See how Legacy.com has helped families honor their loved ones with
            dignity and care.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="rounded-sm bg-white p-6 text-left shadow-sm"
              >
                <p className="text-slate-700 mb-4">" {t.quote} "</p>
                <p className="font-semibold text-[#132855]">{t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
