"use client";
import { Button } from "@/components/ui/button";
import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <section className="flex min-h-[70vh] items-center justify-center bg-linear-to-b from-paper to-[#EFE7DE] px-5">
            <div className="max-w-md space-y-5 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sand">
                    <TriangleAlert className="h-10 w-10 text-ink" />
                </div>
                <h1 className="text-3xl font-bold text-ink">Something went wrong</h1>
                <p className="text-ink-muted">
                    We couldn&apos;t load this page right now. Please try again in a moment.
                </p>
                <div className="flex justify-center gap-3">
                    <Button onClick={reset} size="lg" className="cursor-pointer rounded-full">
                        <RotateCcw className="h-4 w-4" /> Try again
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
