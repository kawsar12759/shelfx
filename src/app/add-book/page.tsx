import React from "react";
import AddBookForm from "../../../components/add-book/AddBookForm";

const AddBook = () => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F6] via-[#F4EFE9] to-[#EEE6DD]" />
            <div className="absolute inset-0 opacity-[0.2] [background-image:radial-gradient(#6B4F3F_0.6px,transparent_0.6px)] [background-size:18px_18px]" />
            <div className="absolute -top-28 right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#E6D8C8]/55 blur-3xl" />
            <div className="absolute -bottom-28 left-[-6rem] h-[28rem] w-[28rem] rounded-full bg-[#EADFD3]/60 blur-3xl" />
            <div className="relative px-4 py-10 md:py-14">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#DAD3C8] bg-white/70 px-4 py-1.5 text-sm font-medium text-[#6B4F3F] shadow-sm backdrop-blur">
                            <span className="h-2 w-2 rounded-full bg-[#6B4F3F]" />
                            Add to your library
                        </span>

                        <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                            Add a New Book
                        </h1>

                        <p className="mx-auto mt-2 max-w-xl text-base md:text-lg text-[#847062] leading-relaxed">
                            Share a literary treasure with our community
                        </p>
                    </div>

                    <div className="mt-8">
                        <AddBookForm />
                        <p className="mt-4 text-center text-sm text-[#847062]">
                            Tip: Use a clear cover image (JPEG/PNG) for the best look.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBook;
