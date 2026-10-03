import { Shimmer } from "../../../../components/BookCardSkeleton";

export default function Loading() {
    return (
        <section className="mx-auto max-w-6xl px-5 pt-8 md:pt-10" aria-busy aria-label="Loading book">
            <Shimmer className="mb-12 h-4 w-56" />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-14">
                <div className="mx-auto w-full max-w-70 space-y-6 md:col-span-4 md:max-w-none">
                    <Shimmer className="aspect-2/3 w-full rounded-l-[3px] rounded-r-[5px]" />
                    <Shimmer className="h-28 rounded-2xl" />
                </div>
                <div className="space-y-5 md:col-span-8">
                    <div className="flex gap-2">
                        <Shimmer className="h-7 w-24 rounded-full" />
                        <Shimmer className="h-7 w-20 rounded-full" />
                    </div>
                    <Shimmer className="h-14 w-4/5" />
                    <Shimmer className="h-7 w-1/3" />
                    <Shimmer className="mt-10 h-20 w-full" />
                    <div className="space-y-3 pt-6">
                        {Array.from({ length: 6 }, (_, i) => (
                            <Shimmer key={i} className={`h-4 ${i === 5 ? "w-2/3" : "w-full"}`} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
