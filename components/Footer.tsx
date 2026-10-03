import Link from "next/link";
import Logo from "./Logo";

const COLUMNS = [
    {
        title: "Discover",
        links: [
            { href: "/explore", label: "All books" },
            { href: "/explore?sort=rating", label: "Top rated" },
            { href: "/explore?sort=popular", label: "Most shelved" },
        ],
    },
    {
        title: "Your shelf",
        links: [
            { href: "/library", label: "My library" },
            { href: "/my-books", label: "Books I've added" },
            { href: "/add-book", label: "Add a book" },
        ],
    },
];

const Footer = () => {
    return (
        <footer className="mt-24 bg-ink text-white/70">
            <div className="mx-auto max-w-7xl px-5 pb-10 pt-16">
                <div className="grid gap-12 md:grid-cols-12">
                    <div className="space-y-5 md:col-span-6">
                        <Logo className="text-white" />
                        <p className="max-w-sm font-serif text-2xl leading-snug tracking-tight text-white/90">
                            A shared shelf for readers: the books you know, the ones you&apos;re reading, and what you thought of them.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <nav key={col.title} aria-label={col.title} className="space-y-4 md:col-span-3">
                            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-white/45">{col.title}</h2>
                            <ul className="space-y-2.5 text-sm">
                                {col.links.map((l) => (
                                    <li key={l.href}>
                                        <Link className="transition-colors hover:text-white" href={l.href}>
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 font-mono text-xs text-white/40 sm:flex-row sm:justify-between">
                    <p>© {new Date().getFullYear()} ShelfX</p>
                    <p>Built with Next.js, MongoDB, Clerk &amp; Cloudinary</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
