export const GENRES = [
    "Classic", "Fiction", "Romance", "Drama", "Gothic",
    "Dystopian", "Adventure", "Poetry", "Mystery",
    "Fantasy", "History", "Science Fiction", "Thriller",
    "Horror", "Non-Fiction", "Biography", "Philosophy",
    "Psychology", "Self-Help",
] as const;

type GenreColor = { bg: string; fg: string };

/**
 * One colour per genre, after Penguin's colour-coded paperbacks. Used for spines,
 * genre markers and genre tiles so a colour always means the same genre.
 */
export const GENRE_COLORS: Record<string, GenreColor> = {
    Classic: { bg: "#1C1917", fg: "#FFFFFF" },
    Fiction: { bg: "#C2410C", fg: "#FFFFFF" },
    Romance: { bg: "#BE185D", fg: "#FFFFFF" },
    Drama: { bg: "#B91C1C", fg: "#FFFFFF" },
    Gothic: { bg: "#581C87", fg: "#FFFFFF" },
    Dystopian: { bg: "#475569", fg: "#FFFFFF" },
    Adventure: { bg: "#FACC15", fg: "#141B34" },
    Poetry: { bg: "#F4B4C4", fg: "#141B34" },
    Mystery: { bg: "#15803D", fg: "#FFFFFF" },
    Fantasy: { bg: "#6D28D9", fg: "#FFFFFF" },
    History: { bg: "#1D4ED8", fg: "#FFFFFF" },
    "Science Fiction": { bg: "#0E7490", fg: "#FFFFFF" },
    Thriller: { bg: "#14532D", fg: "#FFFFFF" },
    Horror: { bg: "#7F1D1D", fg: "#FFFFFF" },
    "Non-Fiction": { bg: "#0369A1", fg: "#FFFFFF" },
    Biography: { bg: "#1E3A8A", fg: "#FFFFFF" },
    Philosophy: { bg: "#3F3F46", fg: "#FFFFFF" },
    Psychology: { bg: "#0F766E", fg: "#FFFFFF" },
    "Self-Help": { bg: "#86EFAC", fg: "#141B34" },
};

const FALLBACK_COLOR: GenreColor = { bg: "#545B6E", fg: "#FFFFFF" };

export function genreColor(genre?: string | null): GenreColor {
    return (genre && GENRE_COLORS[genre]) || FALLBACK_COLOR;
}

export const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "rating", label: "Top rated" },
    { value: "popular", label: "Most shelved" },
    { value: "title", label: "Title A–Z" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export const STATUS_LABELS: Record<ReadingStatus, string> = {
    "want-to-read": "Want to Read",
    reading: "Currently Reading",
    finished: "Finished",
};
