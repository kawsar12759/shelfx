import { BookKey } from "lucide-react";
import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-line bg-paper">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3 lg:col-span-2">
                    <Link href="/" className="flex items-center gap-2 text-ink">
                        <BookKey className="h-6 w-6" />
                        <span className="font-serif text-xl font-bold">ShelfX</span>
                    </Link>
                    <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                        A cozy corner of the internet for readers. Discover books, keep track of
                        what you&apos;re reading and share what you think.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Discover</h3>
                    <ul className="space-y-2 text-sm text-ink-muted">
                        <li><Link className="hover:text-ink" href="/explore">Explore all books</Link></li>
                        <li><Link className="hover:text-ink" href="/explore?sort=rating">Top rated</Link></li>
                        <li><Link className="hover:text-ink" href="/explore?sort=popular">Most shelved</Link></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-ink">Your shelf</h3>
                    <ul className="space-y-2 text-sm text-ink-muted">
                        <li><Link className="hover:text-ink" href="/library">My library</Link></li>
                        <li><Link className="hover:text-ink" href="/add-book">Add a book</Link></li>
                        <li><Link className="hover:text-ink" href="/my-books">Books I&apos;ve added</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-line/70">
                <p className="mx-auto max-w-7xl px-5 py-5 text-xs text-ink-muted">
                    © {new Date().getFullYear()} ShelfX. Built with Next.js, MongoDB, Clerk &amp; Cloudinary.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
