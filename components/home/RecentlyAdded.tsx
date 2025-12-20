"use client";
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const RecentlyAdded = () => {
    const [recentBooks, setRecentBooks] = useState<Array<Book>>([]);

    useEffect(() => {
        const fetchRecentBooks = async () => {
            try {
                const response = await axios.get("/api/books");
                const data = response.data;
                setRecentBooks(data.books)
            } catch (error) {
                console.error("Error fetching books")
            }
        }
        fetchRecentBooks();
    }, [])
    if (recentBooks.length === 0) {
        return (
            <div className='py-5 px-5 min-h-screen flex items-center justify-center text-foreground'>
                <Loader2 className='animate-spin mr-1' />Loading Books....
            </div>
        );
    }
    return <section className='px-4 py-10'>
        <div className='flex items-center justify-between mb-6'>
            <h2 className='text-3xl font-bold text-foreground'>Recently Added</h2>
            <Button variant="outline" asChild>
                <Link href="/explore">View All<ArrowRight /></Link>
            </Button>
        </div>
        <div>
            {recentBooks.map((book) => (
                <p key={book._id}>{book.title}</p>
            ))}
        </div>
    </section>

};

export default RecentlyAdded;