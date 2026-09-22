"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import { SignInButton, useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquareText, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import StarRating from "../StarRating";

const RATING_WORDS = ["", "Didn't like it", "It was okay", "Liked it", "Really liked it", "Loved it"];

const Reviews = ({ bookId }: { bookId: string }) => {
    const { isLoaded, isSignedIn, userId } = useAuth();
    const router = useRouter();
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

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            toast.warn("Pick a star rating first");
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
            toast.error("Couldn't save your review.");
        } finally {
            setSaving(false);
        }
    };

    const removeMine = async () => {
        setSaving(true);
        try {
            await axios.delete(`/api/books/${bookId}/reviews`);
            setReviews((prev) => prev.filter((r) => r.userId !== userId));
            setRating(0);
            setText("");
            router.refresh();
            toast.info("Review deleted");
        } catch {
            toast.error("Couldn't delete your review.");
        } finally {
            setSaving(false);
        }
    };

    const showForm = isSignedIn && (!mine || editing);

    return (
        <section className="space-y-8" aria-labelledby="reviews-heading">
            <h2 id="reviews-heading" className="border-b border-line pb-4 text-4xl text-ink">Ratings &amp; reviews</h2>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Summary */}
                <div className="space-y-4 md:col-span-4">
                    <div className="flex items-end gap-3">
                        <span className={`font-mono text-5xl font-medium ${reviews.length ? "text-ink" : "text-ink-muted/50"}`}>
                            {summary.avg.toFixed(1)}
                        </span>
                        <div className="pb-1.5">
                            <StarRating value={summary.avg} size={18} />
                            <p className="text-xs text-ink-muted">
                                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = summary.counts[star - 1];
                            const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-2 text-xs text-ink-muted">
                                    <span className="w-10">{star} star</span>
                                    <div className="h-2 flex-1 overflow-hidden rounded-sm bg-stack/60">
                                        <div className="h-full rounded-sm bg-signal" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="w-6 text-right tabular-nums">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form + list */}
                <div className="space-y-6 md:col-span-8">
                    {isLoaded && !isSignedIn && (
                        <div className="flex flex-col items-start gap-3 rounded-md border border-dashed border-line bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-ink-muted">Read this one? Share what you thought.</p>
                            <SignInButton mode="modal">
                                <Button size="sm" className="cursor-pointer">Sign in to review</Button>
                            </SignInButton>
                        </div>
                    )}

                    {showForm && (
                        <form onSubmit={submit} className="space-y-3 rounded-md border border-line bg-card p-5">
                            <p className="text-sm font-semibold text-ink">{mine ? "Edit your review" : "Write a review"}</p>
                            <div className="flex items-center gap-3">
                                <StarRating value={rating} size={24} onChange={setRating} />
                                <span className="text-sm text-ink-muted">{RATING_WORDS[rating]}</span>
                            </div>
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                maxLength={2000}
                                rows={4}
                                placeholder="What did you like or dislike? (optional)"
                                className="resize-none bg-white"
                            />
                            <div className="flex items-center justify-end gap-2">
                                {editing && (
                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                                        Cancel
                                    </Button>
                                )}
                                <Button type="submit" size="sm" disabled={saving} className="cursor-pointer">
                                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {mine ? "Update review" : "Post review"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 rounded-md bg-card py-10 text-center text-ink-muted">
                            <MessageSquareText className="h-8 w-8 text-ink-muted/50" />
                            <p className="text-sm">No reviews yet. If you&apos;ve read it, yours can be the first.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-line/70">
                            {reviews.map((r) => (
                                <li key={r._id} className="flex gap-4 py-5 first:pt-0">
                                    {r.userImage ? (
                                        <Image src={r.userImage} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" />
                                    ) : (
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stack font-semibold text-ink">
                                            {r.userName.charAt(0)}
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="font-semibold text-ink">{r.userName}</span>
                                            {r.userId === userId && (
                                                <span className="rounded-sm bg-stack px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink">You</span>
                                            )}
                                            <StarRating value={r.rating} size={14} />
                                            <span className="text-xs text-ink-muted">{formatDate(r.updatedAt)}</span>
                                        </div>
                                        {r.text && <p className="whitespace-pre-line text-sm leading-relaxed text-ink">{r.text}</p>}
                                        {r.userId === userId && !editing && (
                                            <div className="flex gap-3 pt-1 text-xs">
                                                <button type="button" onClick={startEdit} className="cursor-pointer text-ink-muted hover:text-ink">Edit</button>
                                                <button type="button" onClick={removeMine} disabled={saving} className="flex cursor-pointer items-center gap-1 text-ink-muted hover:text-alert">
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
