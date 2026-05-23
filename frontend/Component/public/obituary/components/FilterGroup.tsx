"use client";

import type { FilterOption } from "../types";

export default function FilterGroup({
  title,
  options,
  selectedFilters,
  onToggle,
}: {
  title: string;
  options: FilterOption[];
  selectedFilters: Set<string>;
  onToggle: (filterId: string) => void;
}) {
  return (
    <fieldset className="space-y-4 rounded-md border border-black/6 bg-white px-4 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.07)]">
      <p className="px-1 text-[0.86rem] font-semibold uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 text-[0.98rem] text-slate-700"
          >
            <span className="relative flex h-5 w-5 items-center justify-center">
              <input
                type="checkbox"
                checked={selectedFilters.has(option.id)}
                onChange={() => onToggle(option.id)}
                className="peer h-5 w-5 appearance-none rounded-[0.4rem] border-2 border-[#24314a] bg-white transition checked:border-[#24314a] checked:bg-[#24314a]"
              />
              <span className="pointer-events-none absolute text-[0.68rem] font-bold text-white opacity-0 transition peer-checked:opacity-100">
                ✓
              </span>
            </span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
