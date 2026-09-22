"use client";

import React from "react";
import { useParams } from "next/navigation";
import EditBookForm from "../../../../components/edit-book/EditBookForm";

const EditBook = () => {
    const { id } = useParams<{ id: string }>();

    if (!id) return null;

    return (
        <div className="min-h-screen">
            <div className="px-5 py-10 md:py-14">
                <div className="mx-auto max-w-3xl">
                    <header className="space-y-3 border-b border-line pb-8">
                        <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">My books</p>
                        <h1 className="text-5xl leading-none text-ink md:text-6xl">Edit book</h1>
                        <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                            Changes show up on the book page as soon as you save.
                        </p>
                    </header>

                    <div className="mt-8">
                        <EditBookForm bookId={id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBook;
