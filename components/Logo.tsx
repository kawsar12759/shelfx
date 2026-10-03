import Link from "next/link";
import { cn } from "@/lib/utils";

/** The three-spine mark: spines of different heights, the last one leaning. Matches src/app/icon.svg. */
export const LogoMark = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={cn("h-6 w-6", className)} aria-hidden>
        <rect x="3" y="5" width="4" height="16" rx="0.6" fill="currentColor" />
        <rect x="8.5" y="3" width="4" height="18" rx="0.6" fill="#D9480F" />
        <rect x="15" y="6" width="4" height="15.5" rx="0.6" fill="currentColor" transform="rotate(-14 17 21)" />
    </svg>
);

const Logo = ({ className }: { className?: string }) => (
    <Link
        href="/"
        aria-label="ShelfX home"
        className={cn(
            "group flex items-center gap-2 rounded-md text-ink outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring",
            className
        )}
    >
        <LogoMark className="transition-transform duration-300 group-hover:-rotate-3 motion-reduce:transition-none" />
        <span className="font-serif text-[1.65rem] font-medium leading-none tracking-[-0.03em]">
            Shelf<span className="italic">X</span>
        </span>
    </Link>
);

export default Logo;
