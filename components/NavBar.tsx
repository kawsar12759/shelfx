"use client"
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { BookKey, BookOpen, BookPlus, Compass, Library, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const links = [
    { href: "/", label: "Home", icon: BookOpen },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/library", label: "My Library", icon: Library, signedInOnly: true },
    { href: "/my-books", label: "My Books", icon: BookPlus, signedInOnly: true },
];

const NavBar = () => {
    const pathname = usePathname();
    function isActive(path: string) {
        return path === "/" ? pathname === "/" : pathname.startsWith(path);
    }

    const renderLink = ({ href, label, icon: Icon }: (typeof links)[number]) => (
        <Button key={href} variant={isActive(href) ? "default" : "ghost"} size="sm" asChild>
            <Link href={href} className='gap-2' aria-label={label}>
                <Icon className='w-4 h-4' />
                <span className='hidden md:inline'>{label}</span>
            </Link>
        </Button>
    );

    return (
        <nav className='border-b border-line bg-[#FCFAF7]/80 backdrop-blur-md sticky top-0 z-50 px-4'>
            <div className='mx-auto max-w-7xl'>
                <div className='flex items-center justify-between h-16 gap-2'>
                    <Link href="/" className='flex items-center gap-2 text-ink'>
                        <BookKey className='w-6 h-6' />
                        <span className='font-serif text-xl font-bold'>ShelfX</span>
                    </Link>
                    <div className='flex items-center gap-1 sm:gap-2'>
                        {links.filter((l) => !l.signedInOnly).map(renderLink)}
                        <SignedIn>
                            {links.filter((l) => l.signedInOnly).map(renderLink)}
                            <Button size="sm" variant="outline" asChild className='border-ink/30 text-ink'>
                                <Link href="/add-book" className='gap-2' aria-label="Add Book">
                                    <Plus className='w-4 h-4' />
                                    <span className='hidden lg:inline'>Add Book</span>
                                </Link>
                            </Button>
                            <div className='pl-1'><UserButton /></div>
                        </SignedIn>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button size="sm" className='cursor-pointer'>Sign In</Button>
                            </SignInButton>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
