import Link from "next/link";
import Logo from "./Logo";

const Footer = () => {
    return (
        <footer className="border-t border-line bg-stack/60">
            <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3 lg:col-span-2">
                    <Logo />
                    <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
                        A shared shelf for readers. Add the books you know, track the ones
                        you&apos;re reading and say what you thought of them.
                    </p>
                </div>

                <div className="space-y-3">
                    <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-ink">Discover</h3>
                    <ul className="space-y-2 text-sm text-ink-muted">
                        <li><Link className="hover:text-ink" href="/explore">Explore all books</Link></li>
                        <li><Link className="hover:text-ink" href="/explore?sort=rating">Top rated</Link></li>
                        <li><Link className="hover:text-ink" href="/explore?sort=popular">Most shelved</Link></li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-ink">Your shelf</h3>
                    <ul className="space-y-2 text-sm text-ink-muted">
                        <li><Link className="hover:text-ink" href="/library">My library</Link></li>
                        <li><Link className="hover:text-ink" href="/add-book">Add a book</Link></li>
                        <li><Link className="hover:text-ink" href="/my-books">Books I&apos;ve added</Link></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-line/70">
                <p className="mx-auto max-w-7xl px-5 py-5 font-mono text-xs text-ink-muted">
                    © {new Date().getFullYear()} ShelfX. Built with Next.js, MongoDB, Clerk &amp; Cloudinary.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
