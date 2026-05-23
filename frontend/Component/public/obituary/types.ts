export type SortOption = "latest" | "oldest" | "younger" | "older";

export type SortValue = SortOption | "";

export type FilterGroupKey = "publishDate" | "country";

export interface FilterOption {
  id: string;
  label: string;
}
