"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BookPlus, Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const popularGenres = [
    "Classic", "Fiction", "Romance", "Drama", "Gothic",
    "Dystopian", "Adventure", "Poetry", "Mystery",
    "Fantasy", "History", "Science Fiction", "Thriller",
    "Horror", "Non-Fiction", "Biography", "Philosophy",
    "Psychology", "Self-Help",
];

type FormDataState = {
    title: string;
    author: string;
    summary: string;
    publishedYear: string;
    pages: string;
    language: string;
    cover: File | null;
    genre: string[];
};

type ErrorsState = Partial<Record<keyof FormDataState, string>>;

const EditBookForm = ({ bookId }: { bookId: string }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormDataState>({
        title: "",
        author: "",
        summary: "",
        publishedYear: "",
        pages: "",
        language: "",
        cover: null,
        genre: [],
    });

    const [errors, setErrors] = useState<ErrorsState>({});

    useEffect(() => {
        if (!bookId) return;

        setLoading(true); 

        const fetchBook = async () => {
            try {
                const res = await axios.get(`/api/books/${bookId}`);
                const book = res.data;
                console.log(res);
                setFormData({
                    title: book.title,
                    author: book.author,
                    summary: book.summary,
                    publishedYear: String(book.publishedYear),
                    pages: String(book.pages),
                    language: book.language,
                    cover: null,
                    genre: book.genre,
                });

                setCoverPreview(book.cover);
            } catch {
                toast.error("Failed to load book");
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [bookId]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name as keyof FormDataState]: undefined }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        if (file) {
            const url = URL.createObjectURL(file);
            setCoverPreview(url);
        }

        setFormData((p) => ({ ...p, cover: file }));
        setErrors((p) => ({ ...p, cover: undefined }));
    };

    const handleGenreSelect = (genre: string) => {
        const current = formData.genre;

        if (current.includes(genre)) {
            setFormData((p) => ({ ...p, genre: current.filter((g) => g !== genre) }));
        } else if (current.length < 3) {
            setFormData((p) => ({ ...p, genre: [...current, genre] }));
        }

        setErrors((p) => ({ ...p, genre: undefined }));
    };

    const validateForm = () => {
        const e: ErrorsState = {};
        const year = Number(formData.publishedYear);
        const pages = Number(formData.pages);

        if (!formData.title.trim()) e.title = "Title is required";
        if (!formData.author.trim()) e.author = "Author is required";
        if (formData.genre.length === 0) e.genre = "Select at least one genre";
        if (!formData.summary.trim()) e.summary = "Summary is required";
        if (!year || year < 1000) e.publishedYear = "Invalid year";
        if (!pages || pages <= 0) e.pages = "Invalid pages";
        if (!formData.language.trim()) e.language = "Language required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will update the book details. Make sure all changes are correct.",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#7C2D12",
            cancelButtonColor: "#9CA3AF",
            confirmButtonText: "Yes, update it",
            cancelButtonText: "Cancel",
        });

        if (!result.isConfirmed) return;
        setSaving(true);
        const fd = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "genre") {
                value.forEach((g) => fd.append("genre[]", g));
            } else if (value !== null) {
                fd.append(key, value as string | Blob);
            }
        });

        try {
            await axios.patch(`/api/books/edit/${bookId}`, fd);
            await Swal.fire({
                title: "Updated!",
                text: "The book has been updated successfully.",
                icon: "success",
                timer: 1800,
                showConfirmButton: false,
            });
            router.push("/my-books");
        } catch {
            toast.error("Failed to update book");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="animate-spin w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-6">
            <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="font-semibold text-lg text-[#333]">
                            Book Title *
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Enter the book title"
                            className="h-12 text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.title}
                            onChange={handleInputChange}
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <Label htmlFor="author" className="font-semibold text-lg text-[#333]">
                            Author *
                        </Label>
                        <Input
                            id="author"
                            name="author"
                            placeholder="Enter the author's name"
                            className="h-12 text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.author}
                            onChange={handleInputChange}
                        />
                        {errors.author && (
                            <p className="text-red-500 text-sm">{errors.author}</p>
                        )}
                    </div>

                    {/* Cover */}
                    <div className="space-y-2">
                        <Label htmlFor="cover" className="font-semibold text-lg text-[#333]">
                            Cover Image *
                        </Label>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-32 h-48 bg-muted rounded overflow-hidden border flex items-center justify-center relative">
                                {coverPreview ? (
                                    <Image
                                        src={coverPreview}
                                        alt="Cover Preview"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="text-sm text-muted-foreground">No cover selected</div>
                                )}
                            </div>

                            <div className="flex-1">
                                <input
                                    id="cover"
                                    name="cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:bg-[#6B4F3F] file:text-white file:font-semibold file:tracking-wide hover:file:cursor-pointer active:file:scale-95 hover:file:bg-[#5A4033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2 cursor-pointer"
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Upload a cover image (JPEG/PNG). Max size: 5MB
                                </p>
                                {errors.cover && (
                                    <p className="text-red-500 text-sm mt-1">{errors.cover}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Genre */}
                    <div className="space-y-3">
                        <Label className="font-semibold text-lg text-[#333]">Genre *</Label>
                        <div className="flex flex-wrap gap-2">
                            {popularGenres.map((genre) => (
                                <Button
                                    key={genre}
                                    type="button"
                                    variant={formData.genre.includes(genre) ? "default" : "outline"}
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => handleGenreSelect(genre)}
                                    disabled={formData.genre.length >= 3 && !formData.genre.includes(genre)} 
                                >
                                    {genre}
                                </Button>
                            ))}
                        </div>
                        {errors.genre && <p className="text-red-500 text-sm">{errors.genre}</p>}
                    </div>


                    {/* Summary */}
                    <div className="space-y-2">
                        <Label htmlFor="summary" className="font-semibold text-lg text-[#333]">
                            Summary *
                        </Label>
                        <Textarea
                            id="summary"
                            name="summary"
                            placeholder="Tell us about this book..."
                            rows={8}
                            className="resize-none text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.summary}
                            onChange={handleInputChange}
                        />
                        {errors.summary && (
                            <p className="text-red-500 text-sm">{errors.summary}</p>
                        )}
                    </div>

                    {/* Publication Year */}
                    <div className="space-y-2">
                        <Label htmlFor="publishedYear" className="font-semibold text-lg text-[#333]">
                            Publication Year *
                        </Label>
                        <Input
                            id="publishedYear"
                            name="publishedYear"
                            type="number"
                            placeholder="Enter Publlication Year"
                            min={1000}
                            max={new Date().getFullYear()}
                            className="h-12 text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.publishedYear}
                            onChange={handleInputChange}
                        />
                        {errors.publishedYear && (
                            <p className="text-red-500 text-sm">{errors.publishedYear}</p>
                        )}
                    </div>

                    {/* Pages */}
                    <div className="space-y-2">
                        <Label htmlFor="pages" className="font-semibold text-lg text-[#333]">
                            Number of Pages *
                        </Label>
                        <Input
                            id="pages"
                            name="pages"
                            type="number"
                            placeholder="Enter Number of Pages"
                            className="h-12 text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.pages}
                            onChange={handleInputChange}
                        />
                        {errors.pages && <p className="text-red-500 text-sm">{errors.pages}</p>}
                    </div>

                    {/* Language */}
                    <div className="space-y-2">
                        <Label htmlFor="language" className="font-semibold text-lg text-[#333]">
                            Language *
                        </Label>
                        <Input
                            id="language"
                            name="language"
                            type="text"
                            placeholder="English"
                            className="h-12 text-base focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2"
                            value={formData.language}
                            onChange={handleInputChange}
                        />
                        {errors.language && (
                            <p className="text-red-500 text-sm">{errors.language}</p>
                        )}
                    </div>

                    <Button className="w-full cursor-pointer active:scale-95" disabled={saving}>
                        <BookPlus className={`w-5 h-5 mr-2 ${saving && "animate-spin"}`} />
                        {saving ? "Updating..." : "Update Book"}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default EditBookForm;
