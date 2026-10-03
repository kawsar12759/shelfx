import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-ink-faint hover:border-ink/40 focus-visible:border-ring focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:focus-visible:ring-destructive/15 flex field-sizing-content min-h-16 w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-ink shadow-[inset_0_1px_1px_rgba(20,27,52,0.04)] transition-[color,box-shadow,border-color] outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
