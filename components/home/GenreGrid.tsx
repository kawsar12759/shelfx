import Link from "next/link";

// A rotating set of warm tints so neighbouring tiles feel distinct
const TINTS = ["bg-[#EFE3D6]", "bg-[#E6EBDD]", "bg-[#EEE0E0]", "bg-[#E3E4EE]", "bg-[#F1E8D3]", "bg-[#E2ECE9]"];

const GenreGrid = ({ genres }: { genres: { name: string; count: number }[] }) => {
    if (genres.length === 0) return null;

    return (
        <section className="border-y border-line bg-white/50 px-5 py-16">
            <div className="mx-auto max-w-7xl space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-ink">Browse by genre</h2>
                    <p className="text-ink-muted">Jump straight into the shelves readers are filling up.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {genres.slice(0, 8).map((g, i) => (
                        <Link
                            key={g.name}
                            href={`/explore?genre=${encodeURIComponent(g.name)}`}
                            className={`group flex items-end justify-between rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${TINTS[i % TINTS.length]}`}
                        >
                            <span className="font-serif text-xl font-bold text-ink">{g.name}</span>
                            <span className="text-sm text-ink-muted transition-colors group-hover:text-ink">
                                {g.count} {g.count === 1 ? "book" : "books"} →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GenreGrid;
