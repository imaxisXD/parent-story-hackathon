export default function PublicFooter({
  variant = 'default',
}: {
  variant?: 'default' | 'floating';
}) {
  if (variant === 'floating') {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <div className="rounded-full border border-border bg-white/80 supports-[backdrop-filter]:bg-white/60 backdrop-blur px-3 py-1 shadow-sm text-[11px] sm:text-xs text-muted-foreground">
          Made with care by <strong>Abhishek</strong> · Voice journaling that
          turns into a bedtime story.
        </div>
      </div>
    );
  }
  return (
    <footer className="mt-16 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center text-sm text-muted-foreground">
        <div className="mb-1">
          Made with care by <strong>Abhishek</strong>
        </div>
        <div>Voice journaling that turns into a bedtime story.</div>
      </div>
    </footer>
  );
}
