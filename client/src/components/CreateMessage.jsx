"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { createMessageService } from "../services/Messages/messages";

export default function CreateMessage() {
    const [text, setText] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                localStorage.removeItem("token");
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim() || loading) return;

        setLoading(true);
        try {
            await createMessageService(text);
            setText("");
            
            router.refresh(); 
        } catch (err) {
            console.error("Failed to post message:", err);
            alert("Error sending message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full border-t border-zinc-200 bg-white/80 p-4 backdrop-blur-md">
            <div className="mx-auto max-w-2xl">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Type a message to echo..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={loading}
                            className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-black text-black"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:bg-zinc-300"
                        >
                            {loading ? "Sending..." : "Post"}
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => router.push("/signin")}
                        className="flex w-full items-center justify-between rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-4 text-left transition hover:bg-zinc-100"
                    >
                        <div>
                            <p className="text-sm font-semibold text-zinc-900">Join the conversation</p>
                            <p className="text-xs text-zinc-500">You must be logged in to broadcast messages on Echo.</p>
                        </div>
                        <span className="rounded-lg bg-black px-4 py-2 text-xs font-semibold text-white">
                            Sign In
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}