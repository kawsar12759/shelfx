import React from "react";
import AddBookForm from "../../../components/add-book/AddBookForm";

const AddBook = () => {
    return (
        <div className="min-h-screen">
            <div className="px-5 py-10 md:py-14">
                <div className="mx-auto max-w-3xl">
                    <header className="space-y-3 border-b border-line pb-8">
                        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">My books</p>
                        <h1 className="text-5xl leading-none text-ink md:text-6xl">Add a book</h1>
                        <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                            Anything you add is visible to every reader. You can edit or delete it later from My Books.
                        </p>
                    </header>

                    <div className="mt-8">
                        <AddBookForm />
                        <p className="mt-4 text-sm text-ink-muted">
                            Covers look best as a sharp JPEG or PNG in portrait (2:3) orientation.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
