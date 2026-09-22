"use client";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
    value: number;
    size?: number;
    className?: string;
    /** When provided, the stars become an interactive 1–5 picker. */
    onChange?: (value: number) => void;
};

/** Five stars; fractional values render as partially filled stars. */
const StarRating = ({ value, size = 16, className, onChange }: StarRatingProps) => {
    const [hover, setHover] = useState<number | null>(null);
    const shown = hover ?? value;
    const interactive = Boolean(onChange);

    return (
        <div
            className={cn("inline-flex items-center gap-0.5", className)}
            role={interactive ? "radiogroup" : "img"}
            aria-label={interactive ? "Rating" : `${value.toFixed(1)} out of 5 stars`}
            onMouseLeave={() => setHover(null)}
        >
            {[1, 2, 3, 4, 5].map((star) => {
                const fill = Math.max(0, Math.min(1, shown - (star - 1)));
                const icon = (
                    <span className="relative inline-block" style={{ width: size, height: size }}>
                        <Star className="absolute inset-0 text-line" style={{ width: size, height: size }} strokeWidth={1.5} />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                            <Star className="fill-signal text-signal" style={{ width: size, height: size }} strokeWidth={1.5} />
                        </span>
                    </span>
                );

                if (!interactive) return <React.Fragment key={star}>{icon}</React.Fragment>;

                return (
                    <button
                        key={star}
                        type="button"
                        role="radio"
                        aria-checked={value === star}
                        aria-label={`${star} star${star > 1 ? "s" : ""}`}
                        className="cursor-pointer rounded p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onMouseEnter={() => setHover(star)}
                        onClick={() => onChange?.(star)}
                    >
                        {icon}
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
