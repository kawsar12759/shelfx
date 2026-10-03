"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { SignInButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import StarRating from "../StarRating";
import { useConfirm } from "../ConfirmDialog";
import { Shimmer } from "../BookCardSkeleton";
import SectionHeader from "../SectionHeader";

const RATING_WORDS = ["", "Didn't like it", "It was okay", "Liked it", "Really liked it", "Loved it"];
const MAX_LENGTH = 2000;

const Avatar = ({ review }: { review: Review }) =>
    review.userImage ? (
        <Image src={review.userImage} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
    ) : (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stack font-serif text-lg text-ink" aria-hidden>
            {review.userName.charAt(0)}
        </div>
    );

const Reviews = ({ bookId }: { bookId: string }) => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const router = useRouter();
    const confirm = useConfirm();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        axios
            .get(`/api/books/${bookId}/reviews`)
            .then((res) => setReviews(res.data.reviews))
            .catch(() => setReviews([]))
            .finally(() => setLoading(false));
    }, [bookId]);

    const mine = reviews.find((r) => r.userId === userId);
    // Your own review is pinned to the top of the list
    const ordered = useMemo(() => (mine ? [mine, ...reviews.filter((r) => r !== mine)] : reviews), [reviews, mine]);

    const summary = useMemo(() => {
        const counts = [0, 0, 0, 0, 0];
        reviews.forEach((r) => counts[r.rating - 1]++);
        const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        return { counts, avg };
    }, [reviews]);

    const startEdit = () => {
        if (mine) {
            setRating(mine.rating);
            setText(mine.text);
        }
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
        setRating(0);
        setText("");
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            toast.warn("Choose a star rating to post your review");
            return;
        }
        setSaving(true);
        try {
            const res = await axios.post(`/api/books/${bookId}/reviews`, { rating, text });
            const saved: Review = res.data.review;
            setReviews((prev) => [saved, ...prev.filter((r) => r._id !== saved._id)]);
            setEditing(false);
            router.refresh(); // update the server-rendered rating in the header
            toast.success(mine ? "Review updated" : "Review posted");
        } catch {
            toast.error("Couldn't save your review. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const removeMine = async () => {
        const ok = await confirm({
            title: "Delete your review?",
            description: "Your rating and comments for this book will be removed.",
            confirmLabel: "Delete review",
            tone: "danger",
        });
        if (!ok) return;

        setSaving(true);
        try {
            await axios.delete(`/api/books/${bookId}/reviews`);
            setReviews((prev) => prev.filter((r) => r.userId !== userId));
            setRating(0);
            setText("");
            router.refresh();
            toast.info("Review deleted");
        } catch {
            toast.error("Couldn't delete your review. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const showForm = isSignedIn && (!mine || editing);

    return (
        <section className="space-y-10" aria-labelledby="reviews-heading">
            <SectionHeader title={<span id="reviews-heading">Ratings &amp; reviews</span>} />

            <div className="grid gap-12 md:grid-cols-12">
                {/* Summary */}
                <div className="space-y-6 md:col-span-4">
                    <div className="flex items-end gap-4">
                        <span className={`font-serif text-7xl leading-none tracking-tight ${reviews.length ? "text-ink" : "text-ink/25"}`}>
                            {summary.avg.toFixed(1)}
                        </span>
                        <div className="space-y-1 pb-1.5">
                            <StarRating value={summary.avg} size={16} />
                            <p className="text-xs text-ink-muted">
                                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = summary.counts[star - 1];
                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-3 text-xs text-ink-muted">
                                    <span className="w-3 text-right tabular-nums">{star}</span>
                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/8">
                                        <div className="h-full rounded-full bg-signal transition-[width] duration-700 ease-out-soft" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-6 tabular-nums">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form + list */}
                <div className="space-y-8 md:col-span-8">
                    {isLoaded && !isSignedIn && (
                        <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-serif text-xl text-ink">Read this one?</p>
                                <p className="text-sm text-ink-muted">Sign in to rate it and say what you thought.</p>
                            </div>
                            <SignInButton mode="modal">
                                <Button>Sign in to review</Button>
                            </SignInButton>
                        </div>
                    )}

                    {showForm && (
                        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-line bg-card p-6 shadow-soft">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <p className="font-serif text-xl text-ink">{mine ? "Edit your review" : "Write a review"}</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-ink-muted" aria-live="polite">{RATING_WORDS[rating]}</span>
                                    <StarRating value={rating} size={24} onChange={setRating} />
                                </div>
                            </div>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={MAX_LENGTH}
                                rows={4}
                                aria-label="Your review"
                                placeholder="What stayed with you? (optional)"
                                className="min-h-28 resize-none"
                            />
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-mono text-[11px] text-ink-faint">
                                    {text.length > MAX_LENGTH * 0.8 ? `${MAX_LENGTH - text.length} characters left` : ""}
                                </span>
                                <div className="flex gap-2">
                                    {editing && (
                                        <Button type="button" variant="ghost" onClick={cancelEdit}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={saving}>
                                        {saving && <Loader2 className="animate-spin" />}
                                        {mine ? "Update review" : "Post review"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="space-y-6" aria-busy>
                            {[0, 1].map((i) => (
                                <div key={i} className="flex gap-4">
                                    <Shimmer className="h-10 w-10 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                        <Shimmer className="h-4 w-40" />
                                        <Shimmer className="h-3.5 w-full" />
                                        <Shimmer className="h-3.5 w-3/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="border-y border-line py-10 text-center font-serif text-xl italic text-ink-muted">
                            No reviews yet. If you&apos;ve read it, yours can be the first.
                        </p>
                    ) : (
                        <ul className="divide-y divide-line">
                            {ordered.map((r) => {
                                const isMine = r.userId === userId;
                                if (isMine && editing) return null;
                                return (
                                    <li key={r._id} className="flex gap-4 py-6 first:pt-0">
                                        <Avatar review={r} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <span className="font-semibold text-ink">{r.userName}</span>
                                                {isMine && (
                                                    <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">You</span>
                                                )}
                                                <span className="text-xs text-ink-faint">{formatDate(r.updatedAt)}</span>
                                            </div>
                                            <StarRating value={r.rating} size={13} className="mt-1" />
                                            {r.text && <p className="mt-2.5 max-w-[65ch] whitespace-pre-line leading-relaxed text-ink/90">{r.text}</p>}
                                            {isMine && (
                                                <div className="mt-3 flex gap-4 text-xs font-medium">
                                                    <button type="button" onClick={startEdit} className="cursor-pointer text-ink-muted transition-colors hover:text-ink">Edit</button>
                                                    <button type="button" onClick={removeMine} disabled={saving} className="cursor-pointer text-ink-muted transition-colors hover:text-alert">
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
