"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { BookPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const popularGenres = [
  "Classic",
  "Fiction",
  "Romance",
  "Drama",
  "Gothic",
  "Dystopian",
  "Adventure",
  "Poetry",
  "Mystery",
  "Fantasy",
  "Science Fiction",
  "Thriller",
  "Horror",
  "Non-Fiction",
  "Biography",
  "Philosophy",
  "Psychology",
  "Self-Help",
] as const;

type FormDataState = {
  title: string;
  author: string;
  summary: string;
  publishedYear: string;
  pages: string;
  language: string;
  cover: File | null;
  genre: string;
};

type ErrorsState = Partial<Record<keyof FormDataState, string>>;

const AddBookForm = () => {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataState>({
    title: "",
    author: "",
    summary: "",
    publishedYear: "",
    pages: "",
    language: "",
    cover: null,
    genre: "",
  });

  const [errors, setErrors] = useState<ErrorsState>({});

  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name as keyof FormDataState]: undefined,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (coverPreview) URL.revokeObjectURL(coverPreview);

    if (!file) {
      setFormData((prev) => ({ ...prev, cover: null }));
      setCoverPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    setFormData((prev) => ({ ...prev, cover: file }));

    setErrors((prev) => ({ ...prev, cover: undefined }));
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    setFormData((prev) => ({ ...prev, genre }));
    setErrors((prev) => ({ ...prev, genre: undefined }));
  };

  const validateForm = () => {
    const nextErrors: ErrorsState = {};
    const currentYear = new Date().getFullYear();

    const year = Number(formData.publishedYear);
    const pages = Number(formData.pages);

    if (!formData.title.trim()) nextErrors.title = "Book title is required";
    if (!formData.author.trim()) nextErrors.author = "Author name is required";
    if (!formData.cover) nextErrors.cover = "Cover image is required";
    if (!formData.genre) nextErrors.genre = "Genre is required";
    if (!formData.summary.trim()) nextErrors.summary = "Summary is required";

    if (!formData.publishedYear.trim() || Number.isNaN(year)) {
      nextErrors.publishedYear = "Please enter a valid publication year";
    } else if (year < 1000 || year > currentYear) {
      nextErrors.publishedYear = `Year must be between 1000 and ${currentYear}`;
    }

    if (!formData.pages.trim() || Number.isNaN(pages)) {
      nextErrors.pages = "Please enter a valid number of pages";
    } else if (pages <= 0) {
      nextErrors.pages = "Pages must be greater than 0";
    }

    if (!formData.language.trim()) nextErrors.language = "Language is required";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("author", formData.author);
    fd.append("summary", formData.summary);
    fd.append("publishedYear", formData.publishedYear);
    fd.append("pages", formData.pages);
    fd.append("language", formData.language);
    fd.append("genre", formData.genre);
    if (formData.cover) fd.append("cover", formData.cover);

    fd.forEach((value, key) => console.log(key, value));
    try {
      await axios.post("/api/books", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Book added!!!");
      router.push("/explore");
    } catch (error) {
      console.log("Error adding Book:", error);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
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
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:bg-[#6B4F3F] file:text-white file:font-semibold file:tracking-wide file:transition file:duration-200 file:ease-out hover:file:scale-105 hover:file:bg-[#5A4033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4F3F]/70 focus-visible:ring-offset-2 cursor-pointer"
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
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleGenreSelect(genre)}
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
              placeholder="1813"
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
              placeholder="e.g., 300"
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

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isLoading}>
              <BookPlus className={`w-5 h-5 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              {isLoading ? "Adding..." : "Add Book to Library"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddBookForm;
