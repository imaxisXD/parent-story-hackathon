import type { ReactNode } from "react";

export default function ParentLayout({ children }: { children: ReactNode }) {
  // Wrapper sets data-app="parent" so CSS variables inside this subtree switch to calm theme
  return (
    <div data-app="parent" className="min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
}
