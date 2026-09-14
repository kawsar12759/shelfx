export const GENRES = [
    "Classic", "Fiction", "Romance", "Drama", "Gothic",
    "Dystopian", "Adventure", "Poetry", "Mystery",
    "Fantasy", "History", "Science Fiction", "Thriller",
    "Horror", "Non-Fiction", "Biography", "Philosophy",
    "Psychology", "Self-Help",
] as const;

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
