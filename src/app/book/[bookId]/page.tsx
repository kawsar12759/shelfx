"use client";
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import BookDetails from '../../../../components/BookDetails';

const BookPage = () => {
    const params = useParams();
    const [bookDetails, setBookDetails] = useState<Book | null>(null);
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await axios.get(`/api/books/${params.bookId}`);
                setBookDetails(res.data);
            } catch (error) {
                console.error("Failed to fetch book details", error);
            }
        };

        if (params?.bookId) {
            fetchBookDetails();
        }
    }, [params?.bookId]);
    return (
        <div>
            {bookDetails ? <BookDetails {...bookDetails} /> : <div className="py-24 px-6 min-h-screen flex flex-col items-center justify-center text-[#847062]">
                <Loader2 className="animate-spin text-2xl mb-4" />
                <p className="text-lg font-medium">Loading Books...</p>
            </div>}
        </div>
    );
};

export default BookPage;