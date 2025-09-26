'use client';

const STORY_SKELETON_KEYS = ['today', 'week', 'month'] as const;
const WAVEFORM_BAR_KEYS = [
  'b1',
  'b2',
  'b3',
  'b4',
  'b5',
  'b6',
  'b7',
  'b8',
  'b9',
  'b10',
  'b11',
  'b12',
] as const;
const WEEKDAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
const LEGEND_KEYS = ['lg1', 'lg2', 'lg3', 'lg4', 'lg5'] as const;

export default function ParentPageSkeleton() {
  return (
    <div className="relative z-10">
      <HeaderSkeleton />
      <main className="mx-auto max-w-4xl px-6 py-34">
        <div className="space-y-12">
          <section className="space-y-4">
            <div className="mb-2">
              <div className="h-8 w-56 rounded-md bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-80 rounded-md bg-muted/70 animate-pulse" />
            </div>
            <RecordCardSkeleton />
          </section>

          <section className="space-y-4">
            <div className="mb-2">
              <div className="h-6 w-40 rounded-md bg-muted animate-pulse" />
              <div className="mt-2 h-4 w-60 rounded-md bg-muted/70 animate-pulse" />
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2">
                <div className="h-4 w-64 rounded bg-muted/70 animate-pulse" />
              </div>
              <CalendarSkeleton />
              <div className="mt-4 space-y-2">
                {STORY_SKELETON_KEYS.map((key) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
                  >
                    <div className="h-6 w-7 rounded bg-muted animate-pulse" />
                    <div className="flex-1 min-w-0">
                      <div className="h-4 w-48 rounded bg-muted animate-pulse" />
                      <div className="mt-2 h-3 w-32 rounded bg-muted/70 animate-pulse" />
                    </div>
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 backdrop-blur-sm ">
      <div className="max-w-5xl mx-auto px-4 py-1 rounded-2xl border border-pink-400 shadow-sm bg-[#227effcc] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="size-[54px] rounded-full bg-white/50 animate-pulse" />
              <div>
                <div className="h-6 w-16 rounded bg-white/60 animate-pulse" />
                <div className="mt-1 h-3 w-56 rounded bg-white/40 animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/70 border border-white/80 shadow-xs px-3 h-8">
              <div className="h-3.5 w-3.5 rounded bg-orange-200" />
              <div className="h-3 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="hidden md:flex items-center gap-2 rounded-full bg-white/70 border border-white/80 shadow-xs px-3 h-8">
              <div className="h-3.5 w-3.5 rounded bg-yellow-200" />
              <div className="h-3 w-8 rounded bg-gray-200 animate-pulse" />
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary/50 animate-pulse" />
              </div>
              <div className="h-3 w-10 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function RecordCardSkeleton() {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-pink-200">
      <div className="relative z-10 rounded-[inherit] p-4 pt-6 bg-gradient-to-b from-cyan-50/50 to-pink-50">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="relative w-[110px] h-[110px] rounded-full overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-200/40 via-blue-200/40 to-purple-200/40 animate-pulse" />
            </div>
          </div>
          <div className="text-center space-y-2 min-h-12 w-full max-w-xs">
            <div className="mx-auto h-4 w-32 rounded bg-muted animate-pulse" />
            <div className="mx-auto h-3 w-44 rounded bg-muted/70 animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-1 h-12">
            {WAVEFORM_BAR_KEYS.map((k, i) => (
              <div
                key={k}
                className="w-1 rounded-full bg-blue-200 animate-pulse"
                style={{ height: `${10 + (i % 5) * 8}px` }}
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 rounded-full border border-red-200 bg-white/70 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  // Render a lightweight placeholder grid that resembles the calendar
  const columns = 32; // visually similar without rendering all 53 columns
  const rows = 7;
  const cells = Array.from({ length: columns * rows }, (_, index) => index);

  return (
    <div className="p-2 sm:p-4 border border-border rounded-lg bg-card w-full max-w-full overflow-x-auto">
      <div className="mb-2">
        <div className="h-3 w-48 rounded bg-muted/70 animate-pulse" />
      </div>
      <div className="flex gap-1.5 items-start justify-start">
        <div className="flex flex-col gap-0.5 w-[24px] sm:w-[30px]">
          {WEEKDAY_KEYS.map((label) => (
            <div
              key={label}
              className="h-3 w-5 rounded bg-muted/60 animate-pulse self-end"
            />
          ))}
        </div>
        <div className="grid grid-cols-[repeat(32,8px)] sm:grid-cols-[repeat(32,12px)] grid-rows-[repeat(7,8px)] sm:grid-rows-[repeat(7,12px)] gap-0.5 grid-flow-col justify-start p-0.5 min-w-fit">
          {cells.map((i) => (
            <div
              key={`cell-${i}`}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-3 w-10 rounded bg-muted/60 animate-pulse" />
        <div className="flex gap-1">
          {LEGEND_KEYS.map((k) => (
            <div
              key={k}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-sm bg-gray-200"
            />
          ))}
        </div>
        <div className="h-3 w-10 rounded bg-muted/60 animate-pulse" />
      </div>
    </div>
  );
}
