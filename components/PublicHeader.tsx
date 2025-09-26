'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function PublicHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2">
      <div className="max-w-6xl mx-auto px-4 py-2 rounded-2xl border border-border shadow-sm bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <Image
              src="/kira-mic-nobg.png"
              alt="Kira"
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            <div className="min-w-0">
              <div className="text-xl font-black tracking-tight leading-none">
                Kira
              </div>
              <div className="hidden sm:block text-xs text-muted-foreground truncate">
                Voice journal your day into a bedtime story
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link
              href="/#how-it-works"
              className="text-muted-foreground hover:text-foreground"
            >
              How it works
            </Link>
            <Link
              href="/#faq"
              className="text-muted-foreground hover:text-foreground"
            >
              FAQ
            </Link>
            <Link
              href="/sign-in"
              className="rounded-md border border-border px-3 h-9 inline-flex items-center justify-center hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href="/parent"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground tap-manipulate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start recording
            </Link>
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/sign-in"
              className="rounded-md border border-border px-3 h-8 inline-flex items-center justify-center text-xs hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href="/parent"
              className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground tap-manipulate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Start
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
