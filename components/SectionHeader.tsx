import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    link?: { href: string; label: string };
    as?: "h1" | "h2";
    className?: string;
};

/** Heading row shared by every page section: serif title, quiet subtitle, optional "see all" link. */
const SectionHeader = ({ title, subtitle, link, as: Heading = "h2", className }: SectionHeaderProps) => (
    <div className={cn("flex flex-col items-start justify-between gap-4 md:flex-row md:items-end", className)}>
        <div className="max-w-2xl space-y-2">
            <Heading className={cn("leading-[1.05] text-ink", Heading === "h1" ? "text-5xl md:text-6xl" : "text-4xl md:text-[2.75rem]")}>
                {title}
            </Heading>
            {subtitle && <p className="text-base leading-relaxed text-ink-muted md:text-lg">{subtitle}</p>}
        </div>
        {link && (
            <Link
                href={link.href}
                className="group inline-flex shrink-0 items-center gap-1.5 rounded-full py-1 text-sm font-semibold text-ink outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring"
            >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 group-hover:bg-size-[100%_1px] motion-reduce:transition-none">
                    {link.label}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" />
            </Link>
        )}
    </div>
);

export default SectionHeader;
