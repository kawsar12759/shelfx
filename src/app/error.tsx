"use client";
import { Button } from "@/components/ui/button";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-5">
            <div className="max-w-md space-y-5 text-center">
                <TriangleAlert className="mx-auto h-10 w-10 text-ink" strokeWidth={1.5} />
                <h1 className="text-4xl text-ink">Something went wrong</h1>
                <p className="text-ink-muted">
                    This page didn&apos;t load. Try again, and if it keeps happening, go back to the home page.
                </p>
                <div className="flex justify-center gap-3">
                    <Button onClick={reset} size="lg" className="cursor-pointer">
                        <RotateCcw className="h-4 w-4" /> Try again
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
