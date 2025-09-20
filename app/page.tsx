import Link from "next/link";

export default function Home() {
  return (
    <div data-app="parent" className="relative min-h-screen">
      {/* Delightful, subtle background using brand pink accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 -left-24 size-[280px] rounded-full bg-pink-300/30 blur-3xl"
          style={{ animation: "float 10s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-28 -right-24 size-[320px] rounded-full bg-accent/40 blur-3xl"
          style={{ animation: "float 9s ease-in-out infinite reverse" }}
        />
      </div>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        {/* Hero */}
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="font-serif text-4xl font-extrabold tracking-tight md:text-5xl">
              Turn your day into a magical bedtime story
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">
              Record a moment, pick a character, and we’ll craft a playful, kid‑friendly story—ready by bedtime.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/parent"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium notion-hover"
              >
                I’m a Parent
              </Link>
              <Link
                href="/kids"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110"
              >
                Kids Mode
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 shadow-sm">
                <span className="inline-block size-2 rounded-full bg-green-500"></span>
                <span>Real‑time, private by default</span>
              </div>
              <div className="hidden md:block">No setup required</div>
            </div>
          </div>

          {/* Preview card */}
          <div className="relative">
            <div className="rounded-2xl border border-border bg-white/70 p-5 shadow-md backdrop-blur-sm">
              <div className="mb-2 text-xs font-medium text-muted-foreground">Tonight’s Story</div>
              <div className="rounded-xl bg-gradient-to-br from-pink-100 via-white to-accent/30 p-5">
                <h3 className="font-serif text-2xl font-semibold">The Supermarket Superhero</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  When the apples tried to roll away, our tiny hero leapt into action!
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-pink-100 px-3 py-1 text-xs text-pink-700">Superhero</span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">2 min</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">1. Record your day</div>
            <div className="mt-1 text-sm text-muted-foreground">Just a moment or two—it’s enough.</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">2. Pick a character</div>
            <div className="mt-1 text-sm text-muted-foreground">Astronaut, pirate, superhero, and more.</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">3. Read at bedtime</div>
            <div className="mt-1 text-sm text-muted-foreground">A delightful story, every time.</div>
          </div>
        </section>
      </main>
    </div>
  );
}
