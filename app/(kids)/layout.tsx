import type { ReactNode } from "react";

export default function KidsLayout({ children }: { children: ReactNode }) {
  // Wrapper sets data-app="kids" so CSS variables inside this subtree switch to playful theme
  return (
    <div data-app="kids" className="relative min-h-screen bg-background text-foreground">
      {/* Kids-only decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-24 -left-24 size-[280px] rounded-full bg-pink-300/40 blur-3xl"
          style={{ animation: "float 8s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-28 -right-24 size-[300px] rounded-full bg-blue-200/40 blur-3xl"
          style={{ animation: "float 7s ease-in-out infinite reverse" }}
        />
      </div>
      {children}
    </div>
  );
}
