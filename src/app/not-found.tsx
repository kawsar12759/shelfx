import { Button } from "@/components/ui/button";
import { BookX, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-linear-to-b from-paper to-[#EFE7DE] px-5">
            <div className="max-w-md space-y-5 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sand">
                    <BookX className="h-10 w-10 text-ink" />
                </div>
                <p className="font-serif text-6xl font-extrabold text-ink">404</p>
                <h1 className="text-2xl font-bold text-ink">This page isn&apos;t on our shelves</h1>
                <p className="text-ink-muted">
                    The book or page you&apos;re looking for may have been removed, or the link might be mistyped.
                </p>
                <Button asChild size="lg" className="rounded-full">
                    <Link href="/explore"><Compass className="h-4 w-4" /> Explore books</Link>
                </Button>
            </div>
        </section>
    );
}
