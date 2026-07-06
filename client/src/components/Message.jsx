"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { toggleLikeMessageService, deleteMessageService } from "../services/Messages/messages";

export default function Message({ message }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [likesCount, setLikesCount] = useState(message.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded= jwtDecode(token);
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
            alert("You cannot like your own broadcasted post!");
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
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            await deleteMessageService(message._id);
            router.refresh(); 
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Could not delete message.");
        }
    };

    const isOwner = currentUser && message.user?._id === currentUser.id;
    const isAdmin = currentUser && currentUser.role === "admin";
    const canDelete = isOwner || isAdmin;

    return (
        <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md mx-auto">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    {message.user?.name || "Anonymous"}
                </h2>
                
                <div className="flex items-center gap-4">

                    <button 
                        onClick={handleLike}
                        className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-red-500 text-gray-500"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill={isLiked ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            className={`h-5 w-5 transition-transform active:scale-125 ${isLiked ? "text-red-500" : "text-gray-400"}`}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{likesCount} Likes</span>
                    </button>


                    {canDelete && (
                        <button 
                            onClick={handleDelete}
                            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-500"
                            title="Delete Echo"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            
            <p className="mt-4 text-gray-700 leading-relaxed wrap-break-word">
                {message.content}
            </p>
        </div>
    );
}