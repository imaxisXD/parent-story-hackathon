"use client";

import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

function formatLabel(dateStr: string, todayStr: string) {
  if (dateStr === todayStr) return "Today";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export default function DailyRibbon({
  selectedDate,
  onSelect,
}: {
  selectedDate?: string;
  onSelect: (date?: string) => void;
}) {
  const activityData = useQuery(api.stories.getActivityData);
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const last7 = useMemo(() => {
    if (!activityData || activityData.length === 0) return [] as { date: string; stories: number }[];
    // Get last 7 entries ending with today if present
    const byDate = new Map(activityData.map((d: any) => [d.date, d]));
    const arr: { date: string; stories: number }[] = [];
    const today = new Date(todayStr + "T00:00:00");
    for (let i = 6; i >= 0; i--) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - i);
      const key = dt.toISOString().split("T")[0];
      const entry = byDate.get(key);
      arr.push({ date: key, stories: entry?.stories ?? 0 });
    }
    return arr;
  }, [activityData, todayStr]);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {last7.map((d) => {
        const isSelected = selectedDate === d.date;
        const hasStory = d.stories > 0;
        return (
          <button
            key={d.date}
            onClick={() => onSelect(isSelected ? undefined : d.date)}
            className={`h-9 px-3 rounded-full border text-sm flex items-center gap-2 whitespace-nowrap ${
              isSelected ? "border-primary bg-primary/10" : "border-border bg-white"
            }`}
            title={`${d.date}: ${d.stories} ${d.stories === 1 ? "story" : "stories"}`}
          >
            <span className="font-medium">
              {formatLabel(d.date, todayStr)}
            </span>
            <span
              className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] ${
                hasStory ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {d.stories}
            </span>
          </button>
        );
      })}
      {selectedDate && (
        <button
          onClick={() => onSelect(undefined)}
          className="h-9 px-3 rounded-full border border-border bg-white text-sm"
        >
          Clear date
        </button>
      )}
    </div>
  );
}
