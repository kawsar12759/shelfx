import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BookCard = ({ _id, title, author, cover, genre, addedBy }: Book) => {
    return (
        <Link href={`/book/${_id}`}>
            <div className="group bg-white/70 backdrop-blur-md rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#DAD3C8] h-full">
                <div className="w-full h-96 relative overflow-hidden rounded-t-lg flex items-center justify-center bg-[#FAF7F3]/50">
                    <Image
                        src={cover}
                        alt={title}
                        fill
                        className="w-full h-full  object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                </div>

                <div className="p-4 space-y-2">
                    <h3 className="font-extrabold text-lg text-[#6B4F3F] line-clamp-2 group-hover:text-[#803939] transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-sm text-[#847062] flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {author}
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {genre.map((g, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs bg-[#E6D8C8] text-[#6B4F3F] px-3 py-1 rounded-full"
                            >
                                {g}
                            </Badge>
                        ))}
                    </div>
                    {addedBy && (
                        <p className="text-xs text-[#847062] italic pt-1">
                            Added by: <span className='font-semibold'>{addedBy.firstName}</span>
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default BookCard;
