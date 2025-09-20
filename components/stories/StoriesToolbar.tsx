"use client";

import { useEffect, useMemo, useState } from "react";
import { Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export type StoriesView = "grid" | "list";
export type StoriesSort = "recent" | "mostPlayed" | "highestRated" | "longest";

export default function StoriesToolbar({
  view,
  onViewChange,
  sort,
  onSortChange,
  search,
  onSearchChange,
  onClearAll,
  hasActiveFilters,
}: {
  view: StoriesView;
  onViewChange: (v: StoriesView) => void;
  sort: StoriesSort;
  onSortChange: (s: StoriesSort) => void;
  search: string;
  onSearchChange: (v: string) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => setLocalSearch(search), [search]);

  useEffect(() => {
    const id = setTimeout(() => onSearchChange(localSearch), 250);
    return () => clearTimeout(id);
  }, [localSearch, onSearchChange]);

  const sortLabel = useMemo(() => {
    switch (sort) {
      case "mostPlayed":
        return "Most played";
      case "highestRated":
        return "Highest rated";
      case "longest":
        return "Longest";
      default:
        return "Recents";
    }
  }, [sort]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search stories..."
            className="w-full h-9 pl-10 pr-3 rounded-full border border-border bg-white shadow-xs text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearAll} className="h-8">
            Clear
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as StoriesSort)}
            className="appearance-none h-9 pl-8 pr-8 rounded-full border border-border bg-white shadow-xs text-sm"
            aria-label="Sort stories"
          >
            <option value="recent">Recents</option>
            <option value="mostPlayed">Most played</option>
            <option value="highestRated">Highest rated</option>
            <option value="longest">Longest</option>
          </select>
          <SlidersHorizontal className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-center rounded-full border border-border bg-white shadow-xs p-1">
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-3 ${view === "grid" ? "bg-accent" : ""}`}
            onClick={() => onViewChange("grid")}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-3 ${view === "list" ? "bg-accent" : ""}`}
            onClick={() => onViewChange("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
