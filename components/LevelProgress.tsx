'use client';

import { Star } from 'lucide-react';

export function LevelProgress({
  level,
  progress,
  xp,
  className = '',
}: {
  level: number;
  progress: number; // 0-100 percentage within current level
  xp: number; // total XP
  className?: string;
}) {
  return (
    <div
      className={`hidden md:flex items-center gap-2 rounded-full bg-white border border-border shadow-xs px-3 h-8 text-xs text-muted-foreground ${className}`}
    >
      <Star className="h-3.5 w-3.5 text-yellow-500" />
      <span>Lv {level}</span>
      <div
        className="w-20 h-2 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>
      <span className="tabular-nums">{xp} XP</span>
    </div>
  );
}

export default LevelProgress;
