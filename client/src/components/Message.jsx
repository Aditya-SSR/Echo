"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toggleLikeMessageService, deleteMessageService } from "../services/Messages/messages";
import BrutalistModal from "./BrutalistModal";

const STAMP_COLORS = [
    "#FF5D5D", 
    "#FFD23F", 
    "#4EA8DE", 
    "#7CE38B", 
    "#C77DFF", 
    "#FF9F1C", 
];

function getStampColor(name) {
    const initial = (name || "?").trim().charAt(0).toUpperCase();
    const code = initial.charCodeAt(0) || 0;
    return STAMP_COLORS[code % STAMP_COLORS.length];
}

export default function Message({ message }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [likesCount, setLikesCount] = useState(message.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const [modalConfig, setModalConfig] = useState({ 
        isOpen: false, title: "", message: "", confirmText: "", cancelText: "", onConfirm: null 
    });

    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setCurrentUser(decoded);

                if (message.likes && decoded.id) {
                    const alreadyLiked = message.likes.some((likeObj) => {
                        const likeId = likeObj._id || likeObj;
                        return likeId === decoded.id;
                    });
                    setIsLiked(alreadyLiked);
                }
            } catch (err) {
                console.error("Token decoding error", err);
            }
        }
    }, [message.likes]);

    const handleLike = async () => {
        if (!currentUser) {
            router.push("/signin");
            return;
        }

        if (message.user?._id === currentUser.id) {
            setModalConfig({
                isOpen: true,
                title: "ACTION DENIED",
                message: "You cannot like your own broadcasted post!",
                confirmText: "MY BAD",
                cancelText: "CLOSE",
                onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
            });
            return;
        }

        try {
            await toggleLikeMessageService(message._id);

            if (isLiked) {
                setLikesCount((prev) => Math.max(0, prev - 1));
                setIsLiked(false);
            } else {
                setLikesCount((prev) => prev + 1);
                setIsLiked(true);
            }
            router.refresh();
        } catch (err) {
            console.error("Like toggle failed:", err);
        }
    };

    const handleDelete = async () => {
        setModalConfig({
            isOpen: true,
            title: "DELETE PROMPT",
            message: "Are you sure you want to permanently delete this message snippet from the server cluster?",
            confirmText: "DELETE IT",
            cancelText: "GO BACK",
            onConfirm: async () => {
                setModalConfig((prev) => ({ ...prev, isOpen: false }));
                try {
                    await deleteMessageService(message._id);
                    router.refresh();
                } catch (err) {
                    console.error("Delete failed:", err);
                    setModalConfig({
                        isOpen: true,
                        title: "ERROR OCCURRED",
                        message: "Could not drop message from the server backend grid.",
                        confirmText: "UNDERSTOOD",
                        cancelText: "DISMISS",
                        onConfirm: () => setModalConfig((prev) => ({ ...prev, isOpen: false }))
                    });
                }
            }
        });
    };

    const isOwner = currentUser && message.user?._id === currentUser.id;
    const isAdmin = currentUser && currentUser.role === "admin";
    const canDelete = isOwner || isAdmin;

    const name = message.user?.name || "Anonymous";
    const stampColor = getStampColor(name);
    
    // ⚡ Logic switch: determine badge/avatar check via user.role property from DB
    const isVerifiedAdmin = message.user?.role === "admin";

    return (
        <>
            <div
                className="group w-full max-w-2xl mx-auto bg-[#FAFAF7] border-[3px] border-black
                           shadow-[6px_6px_0px_0px_#000] transition-all duration-150
                           hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_#000]"
            >
                <div className="flex items-center justify-between gap-3 p-4">
                    <div className="flex items-center gap-3 min-w-0">
                        
                        {isVerifiedAdmin ? (
                            <img 
                                src="/Lynxx.png"    
                                alt={name}
                                className="h-11 w-11 shrink-0 border-[3px] border-black object-cover bg-[#FFD23F]"
                            />
                        ) : (
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center border-[3px] border-black
                                           font-sans text-lg font-black text-black"
                                style={{ backgroundColor: stampColor }}
                            >
                                {name.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                                <h2 className="truncate font-sans text-base font-extrabold leading-tight text-black">
                                    {name}
                                </h2>

                                {isVerifiedAdmin && (
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#4EA8DE] text-white" title="Verified Admin">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={4}
                                            className="h-2.5 w-2.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </div>
                            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-black/50">
                                {isVerifiedAdmin ? "Creator / Admin" : "Broadcasting"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleLike}
                            aria-pressed={isLiked}
                            className={`flex items-center gap-1.5 border-[3px] border-black px-2.5 py-1.5
                                        font-mono text-xs font-bold transition-colors
                                        ${isLiked ? "bg-[#FF3B3B] text-black" : "bg-white text-black hover:bg-black hover:text-white"}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={isLiked ? "currentColor" : "none"}
                                stroke="currentColor"
                                strokeWidth={2.5}
                                className="h-4 w-4 transition-transform active:scale-125"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>{likesCount}</span>
                        </button>

                        {canDelete && (
                            <button
                                onClick={handleDelete}
                                title="Delete Echo"
                                className="flex h-8.5 w-8.5 items-center justify-center border-[3px] border-black
                                           bg-white text-black transition-colors hover:bg-[#FF3B3B]"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2.5}
                                    stroke="currentColor"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-t-[3px] border-dashed border-black/20" />

                <p className="p-4 font-mono text-[15px] sm:text-base font-medium leading-relaxed tracking-tight text-black wrap-break-word">
                    <span className="text-black/30 mr-1">&gt;</span>
                    {message.content}
                </p>
            </div>

            <BrutalistModal 
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                message={modalConfig.message}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                onConfirm={modalConfig.onConfirm}
                onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
            />
        </>
    );
}