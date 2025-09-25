import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility to suppress deprecated Daily.js version warnings
export function suppressDeprecatedDailyWarnings() {
  if (typeof window !== 'undefined') {
    // Store original methods
    const originalWarn = console.warn;
    const originalError = console.error;

    // Override console methods to filter out deprecated warnings
    console.warn = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('daily-js version 0.66.0 is no longer supported') ||
        message.includes('is no longer supported') ||
        message.includes('Meeting has ended') ||
        message.includes('Meeting ended due to ejection')
      ) {
        return; // Suppress these warnings
      }
      originalWarn(...args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (
        message.includes('daily-js version 0.66.0 is no longer supported') ||
        message.includes('is no longer supported') ||
        message.includes('Meeting has ended') ||
        message.includes('Meeting ended due to ejection')
      ) {
        return; // Suppress these errors
      }
      originalError(...args);
    };

    // Return cleanup function
    return () => {
      console.warn = originalWarn;
      console.error = originalError;
    };
  }
  return () => {}; // No-op for server-side
}
