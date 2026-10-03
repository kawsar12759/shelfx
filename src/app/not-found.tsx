import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-5 pt-12">
            <div className="max-w-lg text-center">
                {/* Two spines standing, one fallen over */}
                <div className="mx-auto flex h-24 w-32 items-end justify-center gap-1.5" aria-hidden>
                    <span className="h-[80%] w-6 rounded-t-[3px] bg-ink" />
                    <span className="h-full w-6 rounded-t-[3px] bg-signal" />
                    <span className="ml-1 h-6 w-18 rounded-r-[3px] bg-ink/25" />
                </div>
                <div className="mx-auto h-1.5 w-40 rounded-full bg-ink" aria-hidden />
                <p className="eyebrow mt-10">Error 404</p>
                <h1 className="mt-3 text-5xl leading-[1.05] text-ink md:text-6xl">
                    This page isn&apos;t <span className="italic text-ink-muted">on our shelves</span>
                </h1>
                <p className="mt-4 text-ink-muted">
                    The book or page you&apos;re looking for may have been removed, or the link might be mistyped.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-2">
                    <Button asChild size="lg">
                        <Link href="/explore"><Compass /> Explore books</Link>
                    </Button>
                    <Button asChild size="lg" variant="ghost">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
