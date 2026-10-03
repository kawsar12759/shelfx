import Link from "next/link";
import BookCover from "../BookCover";
import SectionHeader from "../SectionHeader";

/** Signed-in readers land back on the books they're partway through. */
const ContinueReading = ({ entries }: { entries: LibraryEntry[] }) => {
    if (entries.length === 0) return null;

    return (
        <section className="px-5 pt-20">
            <div className="mx-auto max-w-7xl space-y-8">
                <SectionHeader title="Continue reading" link={{ href: "/library", label: "Open my library" }} />
                <ul className="grid gap-4 md:grid-cols-3">
                    {entries.map(({ _id, book, currentPage }) => {
                        const percent = book.pages ? Math.min(Math.round((currentPage / book.pages) * 100), 100) : 0;
                        return (
                            <li key={_id}>
                                <Link
                                    href={`/book/${book._id}`}
                                    className="group flex h-full gap-5 rounded-2xl border border-line bg-card p-4 transition-[border-color,box-shadow] duration-300 hover:border-ink/20 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                                >
                                    <div className="w-20 shrink-0 shadow-cover">
                                        <BookCover src={book.cover} title={book.title} sizes="80px" />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col py-1">
                                        <h3 className="text-xl leading-tight text-ink line-clamp-2">{book.title}</h3>
                                        <p className="mt-0.5 text-sm text-ink-muted line-clamp-1">{book.author}</p>
                                        <div className="mt-auto space-y-1.5 pt-3">
                                            <div
                                                className="h-1 overflow-hidden rounded-full bg-ink/10"
                                                role="progressbar"
                                                aria-valuenow={percent}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                aria-label={`${book.title} progress`}
                                            >
                                                <div className="h-full rounded-full bg-ink" style={{ width: `${percent}%` }} />
                                            </div>
                                            <p className="flex justify-between font-mono text-[11px] text-ink-muted">
                                                <span>Page {currentPage} of {book.pages}</span>
                                                <span className="text-ink">{percent}%</span>
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

export default ContinueReading;
