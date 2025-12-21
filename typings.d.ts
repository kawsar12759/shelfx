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
    createdAt: string;
    updatedAt: string;
}