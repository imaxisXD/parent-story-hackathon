export default function KidsHome() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-serif text-4xl font-extrabold">Kids mode</h1>
      <p className="mt-2 text-muted-foreground">Playful, bold, and touch-friendly.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <button className="rounded-xl bg-primary px-5 py-4 text-primary-foreground hover:brightness-110 active:scale-[0.99] transition">
          Play today’s story
        </button>
        <button className="rounded-xl bg-accent px-5 py-4 text-accent-foreground hover:brightness-110 active:scale-[0.99] transition">
          Pick a character
        </button>
        <button className="rounded-xl bg-secondary px-5 py-4 text-secondary-foreground hover:brightness-110 active:scale-[0.99] transition">
          Surprise me!
        </button>
      </div>
    </main>
  );
}
