import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "placeholder:text-ink-faint selection:bg-primary selection:text-primary-foreground border-input h-11 w-full min-w-0 rounded-lg border bg-white px-3.5 py-1 text-base text-ink shadow-[inset_0_1px_1px_rgba(20,27,52,0.04)] transition-[color,box-shadow,border-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-ink/40 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-4",
        "aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/15",
        className
      )}
      {...props}
    />
  )
}

export { Input }
