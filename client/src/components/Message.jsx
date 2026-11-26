"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleLikeMessageService, deleteMessageService } from "../services/Messages/messages";
import { useCurrentUser } from "../lib/auth";
import { timeAgo, fullDate } from "../lib/time";
import Avatar from "./Avatar.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

// Likes arrive from the API as { _id, name } objects, but we add plain ids locally.
const likeId = (like) => like?._id ?? like;

const CLOSED_MODAL = { isOpen: false, title: "", message: "", confirmText: "", cancelText: "", destructive: false, onConfirm: null };

export default function Message({ message, setMessages }) {
    const currentUser = useCurrentUser();
    const router = useRouter();
    const [modal, setModal] = useState(CLOSED_MODAL);

    const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));

    const likes = message.likes || [];
    const likesCount = likes.length;
    const isLiked = !!currentUser && likes.some((like) => likeId(like) === currentUser.id);

    const author = message.user;
    const name = author?.name || "Anonymous";
    const isVerifiedAdmin = author?.role === "admin";
    const isOwner = !!currentUser && author?._id === currentUser.id;
    const canDelete = isOwner || currentUser?.role === "admin";

    const patchLikes = (update) =>
        setMessages((prev) =>
            prev.map((m) => (m._id === message._id ? { ...m, likes: update(m.likes || []) } : m))
        );

    const handleLike = async () => {
        if (!currentUser) {
            router.push("/signin");
            return;
        }

        if (isOwner) {
            setModal({
                ...CLOSED_MODAL,
                isOpen: true,
                title: "You can't like your own echo",
                message: "Save the likes for other people's posts.",
                confirmText: "Got it",
                cancelText: "",
                onConfirm: closeModal,
            });
            return;
        }

        // Optimistic update, rolled back if the request fails.
        const me = currentUser.id;
        const wasLiked = isLiked;
        patchLikes((ls) => (wasLiked ? ls.filter((l) => likeId(l) !== me) : [...ls, me]));

        try {
            await toggleLikeMessageService(message._id);
        } catch (err) {
            console.error("Like toggle failed:", err);
            patchLikes((ls) => (wasLiked ? [...ls, me] : ls.filter((l) => likeId(l) !== me)));
        }
    };

    const handleDelete = () => {
        setModal({
            ...CLOSED_MODAL,
            isOpen: true,
            title: "Delete this echo?",
            message: "This permanently removes the post. You can't undo it.",
            confirmText: "Delete",
            cancelText: "Cancel",
            destructive: true,
            onConfirm: async () => {
                closeModal();
                try {
                    await deleteMessageService(message._id);
                    setMessages((prev) => prev.filter((m) => m._id !== message._id));
                } catch (err) {
                    console.error("Delete failed:", err);
                    setModal({
                        ...CLOSED_MODAL,
                        isOpen: true,
                        title: "Couldn't delete the echo",
                        message: "Something went wrong on the server. Please try again.",
                        confirmText: "OK",
                        cancelText: "",
                        onConfirm: closeModal,
                    });
                }
            },
        });
    };

    return (
        <>
            <article className="flex gap-3 border-b border-line px-4 py-4 transition-colors hover:bg-white/[0.02]">
                <Avatar name={name} admin={isVerifiedAdmin} size={40} />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <h2 className="truncate text-[15px] font-semibold leading-5 text-fg">{name}</h2>

                        {isVerifiedAdmin && (
                            <span
                                className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-black"
                                title="Verified admin"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4} className="h-2.5 w-2.5" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="sr-only">Verified admin</span>
                            </span>
                        )}

                        <span className="text-sm text-faint" aria-hidden="true">·</span>
                        <time
                            dateTime={message.createdAt}
                            title={fullDate(message.createdAt)}
                            className="text-sm leading-5 text-muted"
                        >
                            {timeAgo(message.createdAt)}
                        </time>
                    </div>

                    <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[15px] leading-6 text-fg/90">
                        {message.content}
                    </p>

                    <div className="-ml-2 mt-2 flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handleLike}
                            aria-pressed={isLiked}
                            aria-label={isLiked ? "Unlike" : "Like"}
                            className={`group inline-flex h-8 items-center gap-1.5 rounded-full px-2 text-[13px] transition-colors ${
                                isLiked ? "text-like" : "text-muted hover:bg-like/10 hover:text-like"
                            }`}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth={2}
                                className="h-[18px] w-[18px] transition-transform group-active:scale-125"
                                aria-hidden="true"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {likesCount > 0 && <span className="tabular-nums">{likesCount}</span>}
                        </button>

                        {canDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                title="Delete echo"
                                aria-label="Delete echo"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-[18px] w-[18px]" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </article>

            <ConfirmModal
                isOpen={modal.isOpen}
                title={modal.title}
                message={modal.message}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                destructive={modal.destructive}
                onConfirm={modal.onConfirm}
                onCancel={closeModal}
            />
        </>
    );
}
