"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GENRES, genreColor } from "@/lib/genres";
import { MAX_COVER_BYTES } from "@/lib/limits";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Check, ImageUp, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const MAX_GENRES = 3;
const SUMMARY_MAX = 4000;
const COMMON_LANGUAGES = ["English", "Bengali", "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Japanese", "Chinese", "Arabic", "Hindi"];

export type BookFormValues = {
    title: string;
    author: string;
    summary: string;
    publishedYear: string;
    pages: string;
    language: string;
    genre: string[];
};

type Field = keyof BookFormValues | "cover";
type Errors = Partial<Record<Field, string>>;

// Order of fields on screen, so the first error gets focus
const FIELD_ORDER: Field[] = ["cover", "title", "author", "genre", "summary", "publishedYear", "pages", "language"];

type BookFormProps =
    | { mode: "add"; bookId?: undefined; initial?: undefined; initialCover?: undefined }
    | { mode: "edit"; bookId: string; initial: BookFormValues; initialCover: string };

const EMPTY: BookFormValues = { title: "", author: "", summary: "", publishedYear: "", pages: "", language: "", genre: [] };

const FieldError = ({ id, message }: { id: string; message?: string }) =>
    message ? (
        <p id={id} className="text-sm text-alert animate-in fade-in slide-in-from-top-0.5 duration-200">
            {message}
        </p>
    ) : null;

/** Add and edit share one form; edit mode starts filled in and makes the cover optional. */
const BookForm = ({ mode, bookId, initial, initialCover }: BookFormProps) => {
    const router = useRouter();
    const formRef = useRef<HTMLFormElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [values, setValues] = useState<BookFormValues>(initial ?? EMPTY);
    const [cover, setCover] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(initialCover ?? null);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [dirty, setDirty] = useState(false);

    // Free the object URL of a replaced local preview
    useEffect(() => {
        return () => {
            if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        if (!dirty || saving) return;
        const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => window.removeEventListener("beforeunload", onBeforeUnload);
    }, [dirty, saving]);

    const set = <K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) => {
        setValues((v) => ({ ...v, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
        setDirty(true);
    };

    const onText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        set(e.target.name as keyof Omit<BookFormValues, "genre">, e.target.value);

    const chooseCover = (file: File | null | undefined) => {
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setErrors((e) => ({ ...e, cover: "Choose an image file (JPEG, PNG or WebP)" }));
            return;
        }
        if (file.size > MAX_COVER_BYTES) {
            setErrors((e) => ({ ...e, cover: "This image is over 5 MB. Choose a smaller one." }));
            return;
        }
        setCover(file);
        setPreview(URL.createObjectURL(file));
        setErrors((e) => ({ ...e, cover: undefined }));
        setDirty(true);
    };

    const toggleGenre = (genre: string) => {
        const has = values.genre.includes(genre);
        if (!has && values.genre.length >= MAX_GENRES) return;
        set("genre", has ? values.genre.filter((g) => g !== genre) : [...values.genre, genre]);
    };

    const validate = () => {
        const next: Errors = {};
        const currentYear = new Date().getFullYear();
        const year = Number(values.publishedYear);
        const pages = Number(values.pages);

        if (mode === "add" && !cover) next.cover = "Add a cover image";
        if (!values.title.trim()) next.title = "Enter the book's title";
        if (!values.author.trim()) next.author = "Enter the author's name";
        if (values.genre.length === 0) next.genre = "Pick at least one genre";
        if (!values.summary.trim()) next.summary = "Write a short summary";
        if (!values.publishedYear.trim() || !Number.isInteger(year)) next.publishedYear = "Enter a year, e.g. 1954";
        else if (year < 1000 || year > currentYear) next.publishedYear = `Enter a year between 1000 and ${currentYear}`;
        if (!values.pages.trim() || !Number.isInteger(pages) || pages <= 0) next.pages = "Enter a page count above 0";
        if (!values.language.trim()) next.language = "Enter the language";

        setErrors(next);
        const first = FIELD_ORDER.find((f) => next[f]);
        if (first) {
            const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
            el?.focus({ preventScroll: true });
        }
        return !first;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);

        const fd = new FormData();
        (["title", "author", "summary", "publishedYear", "pages", "language"] as const).forEach((k) => fd.append(k, values[k].trim()));
        values.genre.forEach((g) => fd.append("genre[]", g));
        if (cover) fd.append("cover", cover);

        try {
            if (mode === "add") {
                const res = await axios.post("/api/books", fd);
                setDirty(false);
                toast.success("Book added");
                router.push(`/book/${res.data.book._id}`);
            } else {
                await axios.patch(`/api/books/edit/${bookId}`, fd);
                setDirty(false);
                toast.success("Changes saved");
                router.push(`/book/${bookId}`);
                router.refresh();
            }
        } catch (error) {
            const message = axios.isAxiosError(error) ? error.response?.data?.error : null;
            toast.error(message || (mode === "add" ? "Couldn't add the book. Try again." : "Couldn't save your changes. Try again."));
            setSaving(false);
        }
    };

    const describedBy = (f: Field) => (errors[f] ? `${f}-error` : undefined);

    return (
        <form ref={formRef} onSubmit={handleSubmit} noValidate className="grid gap-10 md:grid-cols-12 md:gap-12">
            {/* Cover */}
            <div className="space-y-3 md:col-span-4">
                <Label htmlFor="cover" className="text-sm font-semibold text-ink">
                    Cover {mode === "edit" && <span className="font-normal text-ink-muted">(optional)</span>}
                </Label>
                <button
                    type="button"
                    data-field="cover"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        chooseCover(e.dataTransfer.files?.[0]);
                    }}
                    aria-describedby={describedBy("cover") ?? "cover-hint"}
                    aria-label={preview ? "Replace cover image" : "Upload cover image"}
                    className={cn(
                        "group relative block aspect-2/3 w-full max-w-60 cursor-pointer overflow-hidden rounded-l-[3px] rounded-r-[6px] transition-[border-color,background-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring md:max-w-none",
                        preview ? "shadow-cover-lg" : "border-2 border-dashed bg-card",
                        !preview && (dragging ? "border-ink bg-ink/4" : errors.cover ? "border-alert/60" : "border-ink/20 hover:border-ink/40")
                    )}
                >
                    {preview ? (
                        <>
                            <Image src={preview} alt="Cover preview" fill sizes="300px" className="object-cover" unoptimized={preview.startsWith("blob:")} />
                            <span className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-ink/70 via-ink/0 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                                <span className="flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink">
                                    <ImageUp className="h-3.5 w-3.5" /> Replace
                                </span>
                            </span>
                        </>
                    ) : (
                        <span className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink">
                                <ImageUp className="h-5 w-5" strokeWidth={1.75} />
                            </span>
                            <span className="text-sm font-semibold text-ink">{dragging ? "Drop to upload" : "Drop a cover here"}</span>
                            <span className="text-xs text-ink-muted">or click to choose a file</span>
                        </span>
                    )}
                </button>
                <input
                    ref={fileRef}
                    id="cover"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    tabIndex={-1}
                    onChange={(e) => {
                        chooseCover(e.target.files?.[0]);
                        e.target.value = ""; // allow choosing the same file again
                    }}
                />
                <FieldError id="cover-error" message={errors.cover} />
                <p id="cover-hint" className="text-xs leading-relaxed text-ink-muted">
                    JPEG, PNG or WebP up to 5 MB. Portrait (2:3) covers look best.
                </p>
            </div>

            {/* Details */}
            <div className="space-y-7 md:col-span-8">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-ink">Title</Label>
                    <Input
                        id="title"
                        name="title"
                        data-field="title"
                        autoComplete="off"
                        placeholder="e.g. The Left Hand of Darkness"
                        className="h-12 font-serif text-xl! placeholder:font-sans placeholder:text-base"
                        value={values.title}
                        onChange={onText}
                        aria-invalid={Boolean(errors.title)}
                        aria-describedby={describedBy("title")}
                    />
                    <FieldError id="title-error" message={errors.title} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-semibold text-ink">Author</Label>
                    <Input
                        id="author"
                        name="author"
                        data-field="author"
                        autoComplete="off"
                        placeholder="e.g. Ursula K. Le Guin"
                        value={values.author}
                        onChange={onText}
                        aria-invalid={Boolean(errors.author)}
                        aria-describedby={describedBy("author")}
                    />
                    <FieldError id="author-error" message={errors.author} />
                </div>

                <fieldset className="space-y-3" aria-describedby={describedBy("genre")}>
                    <legend className="flex w-full items-baseline justify-between text-sm font-semibold text-ink">
                        Genres
                        <span className="font-mono text-[11px] font-normal text-ink-muted">
                            {values.genre.length} of {MAX_GENRES} chosen
                        </span>
                    </legend>
                    <div className="flex flex-wrap gap-1.5 pt-1" data-field="genre" tabIndex={-1}>
                        {GENRES.map((genre) => {
                            const selected = values.genre.includes(genre);
                            const full = !selected && values.genre.length >= MAX_GENRES;
                            return (
                                <button
                                    key={genre}
                                    type="button"
                                    aria-pressed={selected}
                                    disabled={full}
                                    onClick={() => toggleGenre(genre)}
                                    className={cn(
                                        "flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-35",
                                        selected ? "border-ink bg-ink text-white" : "border-line bg-card text-ink-muted hover:border-ink/30 hover:text-ink"
                                    )}
                                >
                                    {selected ? (
                                        <Check className="h-3 w-3" />
                                    ) : (
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: genreColor(genre).bg }} aria-hidden />
                                    )}
                                    {genre}
                                </button>
                            );
                        })}
                    </div>
                    <FieldError id="genre-error" message={errors.genre} />
                </fieldset>

                <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                        <Label htmlFor="summary" className="text-sm font-semibold text-ink">Summary</Label>
                        <span className="font-mono text-[11px] tabular-nums text-ink-faint">
                            {values.summary.length.toLocaleString("en-US")} / {SUMMARY_MAX.toLocaleString("en-US")}
                        </span>
                    </div>
                    <Textarea
                        id="summary"
                        name="summary"
                        data-field="summary"
                        maxLength={SUMMARY_MAX}
                        placeholder="What is the book about? Two or three paragraphs is plenty."
                        className="min-h-48 resize-y leading-relaxed"
                        value={values.summary}
                        onChange={onText}
                        aria-invalid={Boolean(errors.summary)}
                        aria-describedby={describedBy("summary")}
                    />
                    <FieldError id="summary-error" message={errors.summary} />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="publishedYear" className="text-sm font-semibold text-ink">Year published</Label>
                        <Input
                            id="publishedYear"
                            name="publishedYear"
                            data-field="publishedYear"
                            type="number"
                            inputMode="numeric"
                            placeholder="1969"
                            min={1000}
                            max={new Date().getFullYear()}
                            value={values.publishedYear}
                            onChange={onText}
                            aria-invalid={Boolean(errors.publishedYear)}
                            aria-describedby={describedBy("publishedYear")}
                        />
                        <FieldError id="publishedYear-error" message={errors.publishedYear} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="pages" className="text-sm font-semibold text-ink">Pages</Label>
                        <Input
                            id="pages"
                            name="pages"
                            data-field="pages"
                            type="number"
                            inputMode="numeric"
                            placeholder="304"
                            min={1}
                            value={values.pages}
                            onChange={onText}
                            aria-invalid={Boolean(errors.pages)}
                            aria-describedby={describedBy("pages")}
                        />
                        <FieldError id="pages-error" message={errors.pages} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="language" className="text-sm font-semibold text-ink">Language</Label>
                        <Input
                            id="language"
                            name="language"
                            data-field="language"
                            list="language-options"
                            placeholder="English"
                            value={values.language}
                            onChange={onText}
                            aria-invalid={Boolean(errors.language)}
                            aria-describedby={describedBy("language")}
                        />
                        <datalist id="language-options">
                            {COMMON_LANGUAGES.map((l) => <option key={l} value={l} />)}
                        </datalist>
                        <FieldError id="language-error" message={errors.language} />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-line pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-ink-muted">
                        {mode === "add" ? "Every reader on ShelfX will be able to see and shelve this book." : "Changes appear on the book page as soon as you save."}
                    </p>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row">
                        <Button type="button" variant="ghost" size="lg" onClick={() => router.back()} disabled={saving}>
                            Cancel
                        </Button>
                        <Button type="submit" size="lg" disabled={saving || (mode === "edit" && !dirty)}>
                            {saving && <Loader2 className="animate-spin" />}
                            {mode === "add" ? (saving ? "Adding…" : "Add book") : saving ? "Saving…" : "Save changes"}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default BookForm;
