'use client';

import { useQuery } from 'convex/react';
import { memo, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '@/convex/_generated/api';

interface ActivityCalendarProps {
  className?: string;
  title?: string;
  showTitle?: boolean;
  showLegend?: boolean;
  showStats?: boolean;
  showInfographic?: boolean;
  onDaySelect?: (date: string) => void;
}

// Utility functions moved outside component to prevent recreation on each render
const parseLocalDate = (isoDate: string): Date => {
  // Parse YYYY-MM-DD as a local date to avoid timezone shifts
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
const getLevelColor = (level: number): string => {
  switch (level) {
    case 0:
      return 'bg-gray-200';
    case 1:
      return 'bg-pink-100';
    case 2:
      return 'bg-pink-300';
    case 3:
      return 'bg-pink-400/80';
    case 4:
      return 'bg-pink-400';
    default:
      return 'bg-gray-200';
  }
};

const formatTooltipText = (
  date: string,
  stories: number,
  isToday: boolean
): string => {
  const dateObj = parseLocalDate(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${dayName}, ${monthDay}: ${stories} ${stories === 1 ? 'story' : 'stories'} created${isToday ? ' (TODAY)' : ''}`;
};

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ActivityCalendar = memo(function ActivityCalendar({
  className = '',
  title = 'Your Daily Journal Log',
  showTitle = true,
  showLegend = true,
  showStats = true,
  onDaySelect,
}: ActivityCalendarProps) {
  const activityData = useQuery(api.stories.getActivityData);
  const storyStats = useQuery(api.stories.getStoryStats);
  const todayString = useMemo(() => new Date().toISOString().split('T')[0], []);

  const monthLabels = useMemo(() => {
    if (!activityData) return [] as { col: number; text: string }[];

    const labels: { col: number; text: string }[] = [];
    const addedColumns = new Set<number>();

    for (let i = 0; i < activityData.length; i++) {
      const date = parseLocalDate(activityData[i].date);
      const isFirstOfMonth = date.getDate() === 1;
      if (!isFirstOfMonth) continue;

      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const col = Math.floor(i / 7) + 1;
      if (!addedColumns.has(col)) {
        labels.push({ col, text: monthName });
        addedColumns.add(col);
      }
    }

    if (!addedColumns.has(1) && activityData[0]) {
      const firstDate = parseLocalDate(activityData[0].date);
      const firstMonthName = firstDate.toLocaleDateString('en-US', {
        month: 'short',
      });
      labels.unshift({ col: 1, text: firstMonthName });
      addedColumns.add(1);
    }

    return labels;
  }, [activityData]);

  const optimizedActivityData = useMemo(() => {
    if (!activityData) return [];

    return activityData.map((day, index) => {
      const isToday = day.date === todayString;
      const tooltipText = formatTooltipText(day.date, day.stories, isToday);

      const className = `w-3 h-3 rounded-sm cursor-pointer relative hover:outline-1 hover:outline-pink-500/60 ${getLevelColor(day.level)} ${
        isToday ? 'outline-2 outline-blue-500 ' : ''
      }`;

      const style = {
        gridColumn: Math.floor(index / 7) + 1,
        gridRow: (index % 7) + 1,
      };

      return {
        date: day.date,
        className,
        style,
        tooltipText,
      };
    });
  }, [activityData, todayString]);

  // Memoize loading state days to prevent recreation
  const loadingDays = useMemo(
    () =>
      Array.from({ length: 365 }, (_, index) => ({
        className: 'w-3 h-3 rounded-sm bg-gray-200 cursor-pointer',
        style: {
          gridColumn: Math.floor(index / 7) + 1,
          gridRow: (index % 7) + 1,
        } as { gridColumn: number; gridRow: number },
      })),
    []
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className={`space-y-3 ${className}`}>
        {showTitle && (
          <h2 className="text-lg font-medium text-foreground font-serif">
            {title}
          </h2>
        )}

        <div className="p-4 border border-border rounded-lg bg-card w-fit mx-auto">
          <div className="mb-2">
            <p className="text-sm text-muted-foreground">
              Stories created in the past year
            </p>
          </div>

          {/* Calendar with month headers and weekday labels */}
          <div className="flex flex-col gap-1 overflow-x-hidden md:overflow-visible">
            {activityData && (
              <>
                {/* Month labels row */}
                <div className="flex items-center">
                  <div className="w-[30px]"></div>{' '}
                  {/* Empty space for weekday labels */}
                  <div className="grid grid-cols-[repeat(53,12px)] gap-0.5 h-4">
                    {monthLabels.map((label) => (
                      <div
                        key={`${label.text}-${label.col}`}
                        className="text-[10px] text-muted-foreground font-medium leading-none justify-self-center"
                        style={{ gridColumn: label.col }}
                      >
                        {label.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Combined calendar with weekday labels */}
                <div className="flex gap-1.5 items-start justify-start">
                  {/* Weekday labels column */}
                  <div className="flex flex-col gap-0.5 w-[30px]">
                    {WEEKDAY_LABELS.map((day) => (
                      <div
                        key={day}
                        className="text-[9px] text-muted-foreground text-right leading-3 font-medium h-3 flex items-center justify-end pr-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Main calendar grid */}
                  <div className="grid grid-cols-[repeat(53,12px)] grid-rows-[repeat(7,12px)] gap-0.5 grid-flow-col justify-start p-0.5">
                    {optimizedActivityData.map((day) => (
                      <Tooltip key={day.date} disableHoverableContent={true}>
                        <TooltipTrigger asChild>
                          <div
                            className={day.className}
                            style={day.style}
                            // onClick={() => onDaySelect?.(day.date)}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{day.tooltipText}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </>
            )}

            {!activityData && (
              <div className="grid grid-cols-[repeat(53,12px)] grid-rows-[repeat(7,12px)] gap-0.5 grid-flow-col justify-start p-0.5">
                {loadingDays.map((day) => (
                  <Tooltip
                    key={`c${(day.style as { gridColumn: number; gridRow: number }).gridColumn}-r${(day.style as { gridColumn: number; gridRow: number }).gridRow}`}
                    disableHoverableContent
                  >
                    <TooltipTrigger asChild>
                      <div className={day.className} style={day.style} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Loading...</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </div>

          {(showStats || showLegend) && (
            <div className="mt-2 flex items-center justify-between">
              {showStats && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">
                    {storyStats ? storyStats.totalStories : 0}
                  </span>{' '}
                  stories created in the past year
                </div>
              )}
              {showLegend && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-200 "></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-100 "></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-300"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-400/80"></div>
                    <div className="w-3 h-3 rounded-sm bg-pink-400"></div>
                  </div>
                  <span>More</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
});

export default ActivityCalendar;
