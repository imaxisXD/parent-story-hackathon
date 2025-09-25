import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Claymorphic base: rounded pill, glossy top highlight, inner strokes, big soft shadow, press effect.
  // Shadow hue is driven by CSS var --btn-shadow set per-variant, so the base bar matches the button color.
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold select-none transition-transform duration-150 ease-out will-change-transform disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive shadow-[0_8px_0_hsl(var(--btn-shadow)_/_0.7),0_22px_30px_-12px_hsl(var(--btn-shadow)_/_0.35)] active:translate-y-[2px] active:shadow-[0_6px_0_hsl(var(--btn-shadow)_/_0.75),0_16px_24px_-12px_hsl(var(--btn-shadow)_/_0.32)] before:content-[''] before:absolute before:inset-0 before:rounded-[inherit] before:pointer-events-none before:shadow-[inset_0_2px_0_rgba(255,255,255,0.9),inset_0_-2px_0_rgba(0,0,0,0.12)] after:content-[''] after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none after:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.48)_0%,rgba(255,255,255,0.18)_36%,rgba(0,0,0,0.08)_100%)]",
  {
    variants: {
      variant: {
        // Primary (default): saturated pill with glossy sheen
        default:
          "[--btn-shadow:var(--primary)] bg-primary text-primary-foreground hover:brightness-105",
        // Destructive: red clay
        destructive:
          "[--btn-shadow:var(--destructive)] bg-destructive text-white hover:brightness-105 focus-visible:ring-destructive/20",
        // Outline: light pill with border and gloss (shadow matches border tone)
        outline:
          "[--btn-shadow:var(--border)] bg-background text-foreground border border-border hover:brightness-105",
        // Secondary: neutral colored clay pill
        secondary:
          "[--btn-shadow:var(--secondary)] bg-secondary text-secondary-foreground hover:brightness-105",
        // Ghost: translucent pill with subtle border; colored base uses border tone for neutrality
        ghost:
          "[--btn-shadow:var(--border)] bg-background/70 text-foreground border border-border/70 hover:bg-background/80 hover:brightness-105",
        // Link stays text-only
        link: "bg-transparent text-primary underline-offset-4 hover:underline shadow-none before:hidden after:hidden active:translate-y-0",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-full gap-1.5 px-3.5 has-[>svg]:px-3",
        lg: "h-12 rounded-full px-7 has-[>svg]:px-5 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
