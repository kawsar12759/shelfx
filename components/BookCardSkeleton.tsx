import { cn } from "@/lib/utils";

/** Grid used by every list of book cards, so skeletons and results line up exactly. */
export const BOOK_GRID = "grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 md:grid-cols-3 xl:grid-cols-4";

export const Shimmer = ({ className }: { className?: string }) => (
    <div className={cn("animate-pulse rounded-md bg-ink/7 motion-reduce:animate-none", className)} />
);

const BookCardSkeleton = () => (
    <div aria-hidden>
        <Shimmer className="aspect-2/3 w-full rounded-l-[3px] rounded-r-[5px]" />
        <div className="space-y-2.5 pt-4">
            <Shimmer className="h-2.5 w-1/4" />
            <Shimmer className="h-5 w-4/5" />
            <Shimmer className="h-3.5 w-1/2" />
        </div>
    </div>
);

export const BookGridSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className={BOOK_GRID} role="status" aria-label="Loading books">
        {Array.from({ length: count }, (_, i) => (
            <BookCardSkeleton key={i} />
        ))}
    </div>
);

export default BookCardSkeleton;
