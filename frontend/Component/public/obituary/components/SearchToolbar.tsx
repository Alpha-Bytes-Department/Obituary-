"use client";

import { ChevronDown, Filter, Search } from "lucide-react";
import type { SortValue } from "../types";

const sortOptions: Array<{ value: Exclude<SortValue, "">; label: string }> = [
  { value: "latest", label: "Latest to date" },
  { value: "oldest", label: "Oldest to date" },
  { value: "younger", label: "Younger people" },
  { value: "older", label: "Older people" },
];

export default function SearchToolbar({
  query,
  onQueryChange,
  sortOption,
  onSortChange,
  onFiltersToggle,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  sortOption: SortValue;
  onSortChange: (value: SortValue) => void;
  onFiltersToggle: () => void;
}) {
  return (
    <div className="space-y-4 rounded-[2rem] p-6">
      <div className="space-y-2 text-center">
        <p className="font-heading text-3xl font-semibold tracking-[-0.03em] text-[#15345a] sm:text-[2.5rem]">
          Find a Memorial
        </p>
        <p className="text-sm text-slate-500 sm:text-base">
          Search for memorials by name, location, or date
        </p>
      </div>

      <div className="mx-auto flex max-w-4xl flex-col gap-3 lg:flex-row lg:items-center lg:justify-center">
        <div className="flex flex-1 items-center gap-2 rounded-[0.9rem] border border-black/8 bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, location, or date..."
            className="w-full min-w-0 bg-transparent text-[0.98rem] text-slate-700 outline-none placeholder:text-slate-400"
            aria-label="Search memorials"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-60">
            <select
              value={sortOption}
              onChange={(event) =>
                onSortChange(event.target.value as SortValue)
              }
              className="w-full appearance-none rounded-[0.9rem] border border-black/8 bg-[#17365a] px-4 py-3 pr-10 text-sm font-medium text-white shadow-[0_10px_24px_rgba(15,23,42,0.08)] outline-none transition hover:bg-[#132d4c]"
              aria-label="Sort memorials"
            >
              <option value="" className="text-slate-50">
                Sort by
              </option>
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-slate-50"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80" />
          </div>

          <button
            type="button"
            onClick={onFiltersToggle}
            className="inline-flex items-center justify-center gap-2 rounded-[0.9rem] border border-[#17365a] bg-white px-4 py-3 text-sm font-semibold text-[#17365a] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:bg-slate-50 lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>
    </div>
  );
}
