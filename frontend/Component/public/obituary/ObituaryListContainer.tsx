"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter } from "lucide-react";

import { mockObituaries, type ObituaryMock } from "../../../lib/mockData";

import ObituaryCard from "./ObituaryCard";
import FilterStack from "./components/FilterStack";
import PaginationControls from "./components/PaginationControls";
import SearchToolbar from "./components/SearchToolbar";
import type { FilterGroupKey, SortValue } from "./types";

const PAGE_SIZE = 6;

/**
 * Calculates the age at death from birth and death dates.
 */
function getAgeAtDeath(obituary: ObituaryMock): number | undefined {
  if (!obituary.dateOfBirth) {
    return obituary.age;
  }

  const birthDate = new Date(obituary.dateOfBirth);
  const deathDate = new Date(obituary.dateOfDeath);
  let years = deathDate.getFullYear() - birthDate.getFullYear();

  const monthDifference = deathDate.getMonth() - birthDate.getMonth();
  const dayDifference = deathDate.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    years -= 1;
  }

  return years;
}

/**
 * Formats a date for search indexing.
 */
function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

/**
 * Builds searchable text for a memorial.
 */
function getSearchText(obituary: ObituaryMock): string {
  return [
    obituary.deceasedFirstName,
    obituary.deceasedLastName,
    obituary.location.city,
    obituary.location.state,
    obituary.location.country,
    obituary.dateOfBirth,
    obituary.dateOfDeath,
    formatDate(obituary.dateOfBirth ?? obituary.dateOfDeath),
    formatDate(obituary.dateOfDeath),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Matches publish date filters.
 */
function matchesPublishDateFilters(
  obituary: ObituaryMock,
  selectedFilters: Set<string>,
): boolean {
  if (selectedFilters.size === 0) {
    return true;
  }

  const deathDate = new Date(obituary.dateOfDeath);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const lastSevenDays = new Date(startOfToday);
  lastSevenDays.setDate(lastSevenDays.getDate() - 6);
  const lastTwelveMonths = new Date(startOfToday);
  lastTwelveMonths.setMonth(lastTwelveMonths.getMonth() - 12);

  return Array.from(selectedFilters).some((filterId) => {
    if (filterId === "today") {
      return deathDate >= startOfToday;
    }

    if (filterId === "yesterday") {
      return deathDate >= startOfYesterday && deathDate < startOfToday;
    }

    if (filterId === "last7Days") {
      return deathDate >= lastSevenDays;
    }

    if (filterId === "last12Months") {
      return deathDate >= lastTwelveMonths;
    }

    return false;
  });
}

/**
 * Matches country filters.
 */
function matchesCountryFilters(
  obituary: ObituaryMock,
  selectedFilters: Set<string>,
): boolean {
  if (selectedFilters.size === 0) {
    return true;
  }

  return Array.from(selectedFilters).some((filterId) => {
    if (filterId === "irish") {
      return obituary.location.country?.toLowerCase().includes("ireland");
    }

    if (filterId === "uk") {
      return obituary.location.country?.toLowerCase().includes("uk");
    }

    return false;
  });
}

/**
 * Renders the obituary listing page.
 */
export default function ObituaryListContainer() {
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortValue>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [publishDateFiltersSelected, setPublishDateFiltersSelected] = useState<
    Set<string>
  >(() => new Set());
  const [countryFiltersSelected, setCountryFiltersSelected] = useState<
    Set<string>
  >(() => new Set());

  useEffect(() => {
    setCurrentPage(1);
  }, [query, sortOption, publishDateFiltersSelected, countryFiltersSelected]);

  const filteredObituaries = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const matched = mockObituaries.filter((obituary) => {
      const matchesQuery =
        !normalizedQuery || getSearchText(obituary).includes(normalizedQuery);
      return (
        matchesQuery &&
        matchesPublishDateFilters(obituary, publishDateFiltersSelected) &&
        matchesCountryFilters(obituary, countryFiltersSelected)
      );
    });

    if (!sortOption) {
      return matched;
    }

    return [...matched].sort((left, right) => {
      const leftDeath = new Date(left.dateOfDeath).getTime();
      const rightDeath = new Date(right.dateOfDeath).getTime();
      const leftAge = getAgeAtDeath(left) ?? 0;
      const rightAge = getAgeAtDeath(right) ?? 0;

      if (sortOption === "latest") {
        return rightDeath - leftDeath;
      }

      if (sortOption === "oldest") {
        return leftDeath - rightDeath;
      }

      if (sortOption === "younger") {
        return leftAge - rightAge;
      }

      return rightAge - leftAge;
    });
  }, [countryFiltersSelected, publishDateFiltersSelected, query, sortOption]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredObituaries.length / PAGE_SIZE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageItems = filteredObituaries.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  useEffect(() => {
    if (currentPage !== safeCurrentPage) {
      setCurrentPage(safeCurrentPage);
    }
  }, [currentPage, safeCurrentPage]);

  const activeFiltersCount =
    publishDateFiltersSelected.size + countryFiltersSelected.size;

  const handleToggleFilter = (group: FilterGroupKey, filterId: string) => {
    const update = (
      setter: React.Dispatch<React.SetStateAction<Set<string>>>,
    ) => {
      setter((current) => {
        const next = new Set(current);
        if (next.has(filterId)) {
          next.delete(filterId);
        } else {
          next.add(filterId);
        }
        return next;
      });
    };

    if (group === "publishDate") {
      update(setPublishDateFiltersSelected);
      return;
    }

    update(setCountryFiltersSelected);
  };

  return (
    <section className="space-y-8 pb-36 lg:pb-0">
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onFiltersToggle={() => setMobileFiltersOpen((current) => !current)}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <FilterStack
              publishDateFiltersSelected={publishDateFiltersSelected}
              countryFiltersSelected={countryFiltersSelected}
              onToggle={handleToggleFilter}
            />
          </div>
        </aside>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((obituary) => (
              <ObituaryCard key={obituary.id} item={obituary} />
            ))}
          </div>

          {filteredObituaries.length === 0 ? (
            <div className="rounded-md border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              No memorials match the current search or filters.
            </div>
          ) : null}

          <PaginationControls
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 lg:hidden">
        <div
          className={`rounded-t-md border border-black/6 bg-white/98 shadow-[0_-16px_40px_rgba(15,23,42,0.12)] backdrop-blur transition-transform duration-500 ease-out ${
            mobileFiltersOpen
              ? "translate-y-0"
              : "translate-y-[calc(100%-3.75rem)]"
          }`}
        >
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((current) => !current)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
            aria-expanded={mobileFiltersOpen}
          >
            <span className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 ? (
                <span className="rounded-full bg-[#17365a] px-2 py-0.5 text-[0.7rem] font-semibold text-white">
                  {activeFiltersCount}
                </span>
              ) : null}
            </span>
          </button>

          <div className="max-h-[68vh] overflow-y-auto px-4 pb-4">
            <FilterStack
              publishDateFiltersSelected={publishDateFiltersSelected}
              countryFiltersSelected={countryFiltersSelected}
              onToggle={handleToggleFilter}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
