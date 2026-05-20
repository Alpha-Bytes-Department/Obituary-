"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import useDebounce from "@/hooks/useDebounce";

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

    const nextUrl = nextParams.toString() ? `/?${nextParams.toString()}` : "/";
    const currentUrl = searchParams.toString()
      ? `/?${searchParams.toString()}`
      : "/";

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl);
    }
  }, [debouncedQuery, router, searchParams]);

  return (
    <label className="block max-w-2xl">
      <span className="sr-only">Search obituaries</span>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by name or city"
        className="w-full rounded-full border border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/45 outline-none transition focus:border-white/25 focus:bg-white/15"
        aria-label="Search obituaries"
      />
    </label>
  );
}
