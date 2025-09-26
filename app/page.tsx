import Image from 'next/image';
import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';
import PublicHeader from '@/components/PublicHeader';

export default function Home() {
  return (
    <div data-app="parent" className="relative min-h-screen">
      <PublicHeader />
      <main id="main" className="mx-auto max-w-6xl px-6 py-24">
        <section className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-13 ">
              <span>
                <span className="text-primary">Voice‑journal</span> your day
              </span>{' '}
              <br />
              We’ll make it a{' '}
              <span className="text-blue-600">bedtime story</span>
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              Take a minute to speak your day out loud. Feel lighter, notice the
              small wins, and end the night with a gentle story to listen with
              your kid.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/parent"
                className="inline-flex drop-shadow-pink-300 drop-shadow-2xl h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-white hover:bg-primary/80 bg-primary tap-manipulate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start recording
              </Link>
            </div>
          </div>

          <div className="relative cloud-frame md:justify-self-end">
            <Image
              src="/hero.webp"
              alt="Kira talking to a kid"
              width={500}
              height={500}
              className="rounded-xl shadow-xl ring-1 ring-border/50"
              priority
            />
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mt-16 grid gap-4 sm:grid-cols-3 scroll-mt-24"
        >
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">1. Journal by talking</div>
            <div className="mt-1 text-sm text-muted-foreground">
              A minute is enough.
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">
              2. We craft a calm story
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Kid‑friendly and short.
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 notion-card">
            <div className="text-sm font-semibold">3. Listen together</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Make bedtime warm and easy.
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="faq" className="mt-20">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="h-28 w-full rounded-lg bg-muted/60 fun-dotted-bg flex items-center justify-center text-xs text-muted-foreground">
                Image placeholder
              </div>
              <h3 className="mt-4 text-base font-semibold">Feel lighter</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A tiny daily check‑in, out loud.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="h-28 w-full rounded-lg bg-muted/60 fun-dotted-bg flex items-center justify-center text-xs text-muted-foreground">
                Image placeholder
              </div>
              <h3 className="mt-4 text-base font-semibold">
                Turn days into stories
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Moments become short, gentle tales.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5 hover-lift">
              <div className="h-28 w-full rounded-lg bg-muted/60 fun-dotted-bg flex items-center justify-center text-xs text-muted-foreground">
                Image placeholder
              </div>
              <h3 className="mt-4 text-base font-semibold">
                A keepsake you’ll revisit
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your calm archive of everyday life.
              </p>
            </div>
          </div>
        </section>

        {/* Example stories */}
        <section className="mt-20">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Story examples
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Short, soothing, bedtime‑ready.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <div className="h-24 w-full rounded-lg bg-muted/60 fun-dotted-bg flex items-center justify-center text-xs text-muted-foreground">
                    Cover placeholder
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-semibold">
                      A tiny win today
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
                      A calm, kind retelling from your day.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-20">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">
                Loved by busy parents
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Journaling that kids love listening to.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {(
                [
                  'It’s our favorite wind‑down.',
                  'Makes me notice small joys.',
                  'My kid asks for their story!',
                ] as const
              ).map((quote) => (
                <div
                  key={quote}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <div className="text-sm">“{quote}”</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    — Parent
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Quick answers to common questions.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="text-sm font-semibold">
                  Are my recordings private?
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes. Your recordings are private by default.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="text-sm font-semibold">
                  How long are the stories?
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Usually 1–3 minutes—just right for bedtime.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="text-sm font-semibold">Can I edit a story?</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Absolutely. Nudge words, swap characters, or save drafts.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-white p-4">
                <div className="text-sm font-semibold">
                  Do you support multiple kids?
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Yes—tag entries so each child gets their own tale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 mb-10">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-pink-50 to-accent/20 p-6 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to start your family’s story?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Take 60 seconds today and listen together tonight.
            </p>
            <div className="mt-4 flex items-center justify-center">
              <Link
                href="/parent"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground tap-manipulate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start recording
              </Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}
