"use client"
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Menu, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Logo from './Logo';

const links = [
    { href: "/explore", label: "Explore" },
    { href: "/library", label: "My Library", signedInOnly: true },
    { href: "/my-books", label: "My Books", signedInOnly: true },
];

/** Compact search that hands off to the explore page. */
const NavSearch = ({ className, onSubmitted }: { className?: string; onSubmitted?: () => void }) => {
    const router = useRouter();
    const [value, setValue] = useState("");

    return (
        <form
            role="search"
            className={cn("relative", className)}
            onSubmit={(e) => {
                e.preventDefault();
                const q = value.trim();
                router.push(q ? `/explore?q=${encodeURIComponent(q)}` : "/explore");
                setValue("");
                onSubmitted?.();
            }}
        >
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
                type="search"
                data-search-input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search books"
                aria-label="Search books by title or author"
                className="peer h-10 w-full rounded-full border border-transparent bg-ink/5 pl-10 pr-10 text-sm text-ink transition-[background-color,border-color,box-shadow] placeholder:text-ink-muted hover:bg-ink/7 focus-visible:border-line focus-visible:bg-white focus-visible:shadow-soft focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-line bg-white px-1.5 font-mono text-[10px] text-ink-muted peer-focus:hidden lg:block">
                /
            </kbd>
        </form>
    );
};

const NavBar = () => {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [prevPath, setPrevPath] = useState(pathname);

    // Close the mobile menu whenever the route changes
    if (pathname !== prevPath) {
        setPrevPath(pathname);
        setMenuOpen(false);
    }

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // "/" jumps to whichever search box is on screen (the explore page has its own)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
            const target = e.target as HTMLElement;
            if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
            const input = [...document.querySelectorAll<HTMLInputElement>("[data-search-input]")].find((el) => el.offsetParent !== null);
            if (!input) return;
            e.preventDefault();
            input.focus();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Lock page scroll behind the open mobile menu, and let Esc close it
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKey);
        };
    }, [menuOpen]);

    const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));
    const onExplore = pathname.startsWith("/explore");

    const renderLink = ({ href, label }: (typeof links)[number]) => (
        <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
                "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors outline-offset-2 focus-visible:outline-2 focus-visible:outline-ring",
                isActive(href) ? "text-ink" : "text-ink-muted hover:text-ink"
            )}
        >
            {label}
            <span
                aria-hidden
                className={cn(
                    "absolute inset-x-3.5 -bottom-3.25 h-0.5 rounded-full bg-ink transition-opacity",
                    isActive(href) ? "opacity-100" : "opacity-0"
                )}
            />
        </Link>
    );

    const renderMobileLink = ({ href, label }: (typeof links)[number]) => (
        <Link
            key={href}
            href={href}
            aria-current={isActive(href) ? "page" : undefined}
            className={cn(
                "flex items-center justify-between border-b border-line py-4 font-serif text-3xl tracking-tight",
                isActive(href) ? "text-ink" : "text-ink/75"
            )}
        >
            {label}
            {isActive(href) && <span className="h-2 w-2 rounded-full bg-signal" aria-hidden />}
        </Link>
    );

    return (
        <header
            className={cn(
                "sticky top-0 z-50 border-b px-5 transition-[background-color,border-color,box-shadow] duration-300",
                // No backdrop-filter while the menu is open: it would become the containing block for the fixed panel
                menuOpen
                    ? "border-line bg-background"
                    : scrolled
                        ? "border-line bg-background/85 shadow-[0_8px_24px_-18px_rgba(20,27,52,0.35)] backdrop-blur-md backdrop-saturate-150"
                        : "border-transparent bg-background"
            )}
        >
            <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4" aria-label="Main">
                <Logo className="shrink-0" />

                <div className="ml-4 hidden items-center gap-0.5 md:flex">
                    {links.filter((l) => !l.signedInOnly).map(renderLink)}
                    <SignedIn>{links.filter((l) => l.signedInOnly).map(renderLink)}</SignedIn>
                </div>

                <div className="ml-auto flex items-center gap-2">
                    {!onExplore && <NavSearch className="hidden w-56 md:block lg:w-64" />}

                    <SignedIn>
                        <Button size="sm" variant="outline" asChild className="hidden h-9 sm:inline-flex">
                            <Link href="/add-book">
                                <Plus /> Add a book
                            </Link>
                        </Button>
                        <div className="flex h-9 w-9 items-center justify-center">
                            <UserButton appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }} />
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button size="sm" variant="ghost" className="h-9">Sign in</Button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <Button size="sm" className="hidden h-9 sm:inline-flex">Get started</Button>
                        </SignUpButton>
                    </SignedOut>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                    </Button>
                </div>
            </nav>

            {menuOpen && (
                <div
                    id="mobile-menu"
                    className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-background px-5 pb-10 pt-4 animate-in fade-in slide-in-from-top-2 duration-300 motion-reduce:animate-none md:hidden"
                >
                    <NavSearch className="mb-4" onSubmitted={() => setMenuOpen(false)} />
                    <div className="flex flex-col">
                        {renderMobileLink({ href: "/", label: "Home" })}
                        {links.filter((l) => !l.signedInOnly).map(renderMobileLink)}
                        <SignedIn>
                            {links.filter((l) => l.signedInOnly).map(renderMobileLink)}
                            {renderMobileLink({ href: "/add-book", label: "Add a book" })}
                        </SignedIn>
                    </div>
                    <SignedOut>
                        <div className="mt-8 space-y-3">
                            <p className="text-sm text-ink-muted">Sign in to keep a shelf, log your progress and write reviews.</p>
                            <SignUpButton mode="modal">
                                <Button size="lg" className="w-full">Get started</Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                </div>
            )}
        </header>
    );
};

export default NavBar;
