"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { createMessageService } from "../services/Messages/messages";


export default function CreateMessage({ setMessages }) {
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
   
            const responseData = await createMessageService(text);
            setText("");

            if (responseData) {
                setMessages((prev) => [responseData, ...prev]);
            }
        } catch (err) {
            console.error("Failed to post message:", err);
            alert("Error sending message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 w-full border-t-[3px] border-black bg-[#FAFAF7] p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:pb-[calc(1rem+env(safe-area-inset-bottom))] z-50">
            <div className="mx-auto max-w-2xl">
                {user ? (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <input
                            type="text"
                            placeholder="Type your echo..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={loading}
                            className="w-full border-[3px] border-black bg-white px-4 py-3 font-mono text-sm text-black
                                       placeholder:text-black/40 outline-none transition-all
                                       focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5
                                       disabled:bg-zinc-100"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading || !text.trim()}
                            className="shrink-0 border-[3px] border-black bg-black px-6 py-3 font-mono text-sm font-bold
                                       uppercase tracking-wider text-white transition-all
                                       hover:bg-white hover:text-black
                                       active:translate-x-0.5 active:translate-y-0.5
                                       disabled:border-zinc-300 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300 disabled:hover:text-zinc-500"
                        >
                            {loading ? "Transmitting…" : "Broadcast"}
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => router.push("/signin")}
                        className="flex w-full items-center justify-between gap-3 border-[3px] border-dashed border-black bg-white p-4 text-left transition-colors hover:bg-zinc-50"
                    >
                        <div className="min-w-0">
                            <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-black/50">
                                Console locked
                            </p>
                            <p className="font-sans text-sm font-extrabold text-black">
                                Sign in to broadcast on Echo
                            </p>
                        </div>
                        <span className="shrink-0 border-[3px] border-black bg-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white">
                            Sign In
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}