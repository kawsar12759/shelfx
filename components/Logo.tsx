import Link from "next/link";

/** Wordmark: three spines of different heights, the last one leaning. Matches src/app/icon.svg. */
const Logo = () => (
    <Link href="/" className="flex items-center gap-2 rounded-sm text-ink outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
            <rect x="3" y="5" width="4" height="16" fill="currentColor" />
            <rect x="8.5" y="3" width="4" height="18" fill="#D9480F" />
            <rect x="15" y="6" width="4" height="15.5" fill="currentColor" transform="rotate(-14 17 21)" />
        </svg>
        <span className="font-condensed text-2xl font-extrabold tracking-tight">ShelfX</span>
    </Link>
);

export default Logo;
