"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import useDebounce from "../../../hooks/useDebounce";

/**
 * Renders the homepage search bar with debounced URL updates.
 *
 * @returns {JSX.Element} The hero search form.
 */
export default function HeroSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (debouncedQuery.trim()) {
      nextParams.set("q", debouncedQuery.trim());
    } else {
      nextParams.delete("q");
    }

    const nextUrl = nextParams.toString() ? `/obituary?${nextParams.toString()}` : "/obituary";
    const currentUrl = searchParams.toString()
      ? `/obituary?${searchParams.toString()}`
      : "/obituary";

    if (nextUrl !== currentUrl) {
      router.push(nextUrl);
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <form className="block w-full max-w-2xl">
      <span className="sr-only">Search obituaries</span>
      <div className="flex items-stretch overflow-hidden rounded-[0.7rem] bg-white shadow-[0_18px_40px_rgba(31,41,55,0.18)] ring-1 ring-black/5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search memorials by name, location, or date..."
          className="min-w-0 flex-1 px-5 py-4 text-[1rem] text-slate-700 outline-none placeholder:text-slate-400"
          aria-label="Search obituaries"
        />
        <button
          type="button"
          className="flex items-center justify-center bg-[#1e3a5f] px-5 text-white transition hover:bg-[#16314f]"
          aria-label="Search memorials"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
