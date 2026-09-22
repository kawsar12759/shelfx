const BookCardSkeleton = () => (
    <div aria-hidden>
        <div className="aspect-2/3 w-full animate-pulse rounded-sm bg-stack" />
        <div className="space-y-2 pt-3">
            <div className="h-5 w-4/5 animate-pulse rounded bg-stack/60" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-stack/50" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-stack/40" />
        </div>
    </div>
);

export const BookGridSkeleton = ({ count = 8 }: { count?: number }) => (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }, (_, i) => (
            <BookCardSkeleton key={i} />
        ))}
    </div>
);

export default BookCardSkeleton;
