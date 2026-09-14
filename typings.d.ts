interface Book {
    _id: string;
    title: string;
    author: string;
    cover: string;
    genre: string[];
    summary: string;
    publishedYear: number;
    pages: number;
    language: string;
    addedBy: {
        id: string;
        firstName: string;
    };
    ratingAvg?: number;
    ratingCount?: number;
    readersCount?: number;
    createdAt: string;
    updatedAt: string;
}

type ReadingStatus = "want-to-read" | "reading" | "finished";

interface LibraryEntry {
    _id: string;
    userId: string;
    book: Book;
    status: ReadingStatus;
    currentPage: number;
    startedAt?: string;
    finishedAt?: string;
    createdAt: string;
    updatedAt: string;
}

interface Review {
    _id: string;
    book: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    text: string;
    createdAt: string;
    updatedAt: string;
}
