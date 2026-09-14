export default function Loading() {
    return (
        <section className="min-h-screen bg-linear-to-b from-paper via-[#F4EFE9] to-[#EFE7DE]" aria-busy>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 py-16 md:grid-cols-12">
                <div className="mx-auto w-full max-w-xs space-y-5 md:col-span-4 md:max-w-none">
                    <div className="aspect-2/3 w-full animate-pulse rounded-lg bg-sand/60" />
                    <div className="h-24 animate-pulse rounded-xl bg-sand/40" />
                </div>
                <div className="space-y-5 md:col-span-8">
                    <div className="h-6 w-40 animate-pulse rounded-full bg-sand/50" />
                    <div className="h-12 w-3/4 animate-pulse rounded bg-sand/60" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-sand/50" />
                    <div className="grid grid-cols-4 gap-3">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} className="h-16 animate-pulse rounded-xl bg-sand/40" />
                        ))}
                    </div>
                    <div className="space-y-2 pt-4">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div key={i} className="h-4 animate-pulse rounded bg-sand/40" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
