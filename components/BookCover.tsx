import Image from "next/image";
import { cn } from "@/lib/utils";

type BookCoverProps = {
    src: string;
    title: string;
    sizes: string;
    priority?: boolean;
    className?: string;
};

/**
 * A cover drawn as a physical book: square fore-edge, a shaded hinge where the
 * spine meets the board, and a faint sheen. The parent sets width and shadow.
 */
const BookCover = ({ src, title, sizes, priority, className }: BookCoverProps) => (
    <div className={cn("relative aspect-2/3 w-full overflow-hidden rounded-l-[3px] rounded-r-[5px] bg-stack", className)}>
        <Image src={src} alt={`Cover of ${title}`} fill sizes={sizes} priority={priority} className="object-cover" />
        <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[7%]"
            style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.22), rgba(255,255,255,0.16) 45%, rgba(0,0,0,0.08) 70%, transparent)" }}
        />
        <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-black/10"
            style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.12), transparent 40%)" }}
        />
    </div>
);

export default BookCover;
