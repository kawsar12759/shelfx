import { Button } from "@/components/ui/button";
import { BookX, Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="max-w-md space-y-5 text-center">
                <p className="font-mono text-sm uppercase tracking-wider text-ink-muted">
                    <BookX className="mr-1.5 inline h-4 w-4 align-[-3px]" /> Error 404
                </p>
                <h1 className="text-5xl leading-none text-ink">This page isn&apos;t on our shelves</h1>
                <p className="text-ink-muted">
                    The book or page you&apos;re looking for may have been removed, or the link might be mistyped.
                </p>
                <Button asChild size="lg">
                    <Link href="/explore"><Compass className="h-4 w-4" /> Explore books</Link>
                </Button>
            </div>
        </section>
    );
}
