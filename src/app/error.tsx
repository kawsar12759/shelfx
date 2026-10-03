"use client";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-5 pt-12">
            <div className="max-w-lg text-center">
                <p className="eyebrow">Something went wrong</p>
                <h1 className="mt-3 text-5xl leading-[1.05] text-ink">
                    This page <span className="italic text-ink-muted">didn&apos;t load</span>
                </h1>
                <p className="mt-4 text-ink-muted">
                    It may be a brief connection problem. Try again, and if it keeps happening, head back to the home page.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <Button onClick={reset} size="lg">
                        <RotateCcw /> Try again
                    </Button>
                    <Button asChild variant="ghost" size="lg">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
