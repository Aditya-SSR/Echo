"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { createMessageService } from "../services/Messages/messages";
import { useCurrentUser } from "../lib/auth";
import { getSocket } from "../lib/socket";
import Avatar from "./Avatar.jsx";

const MAX_LENGTH = 280;

export default function CreateMessage({ setMessages }) {
    const user = useCurrentUser();
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const textareaRef = useRef(null);
    const typing = useRef({ active: false, lastSent: 0, timer: null });

    // Tell the server we stopped typing (idle, blurred, posted, or left the page).
    const stopTyping = useCallback(() => {
        const t = typing.current;
        clearTimeout(t.timer);
        if (t.active) {
            t.active = false;
            getSocket().emit("typing:stop");
        }
    }, []);

    useEffect(() => stopTyping, [stopTyping]);

    const handleChange = (e) => {
        const value = e.target.value;
        setText(value);

        if (!value.trim()) {
            stopTyping();
            return;
        }

        const socket = getSocket();
        if (!socket.connected) return;

        // Re-send every ~2s while typing; the server drops us after 5s of silence.
        const t = typing.current;
        const now = Date.now();
        if (!t.active || now - t.lastSent > 2000) {
            socket.emit("typing:start");
            t.active = true;
            t.lastSent = now;
        }
        clearTimeout(t.timer);
        t.timer = setTimeout(stopTyping, 3000);
    };

    // Grow the textarea with its content.
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [text]);

    const submit = async () => {
        if (!text.trim() || loading) return;

        stopTyping();
        setLoading(true);
        setError("");
        try {
            const created = await createMessageService(text);
            setText("");
            if (created && created._id) {
                // The live "message:new" event may have added it already.
                setMessages((prev) => (prev.some((m) => m._id === created._id) ? prev : [created, ...prev]));
            }
        } catch (err) {
            console.error("Failed to post message:", err);
            setError(err.response?.data?.message || "Couldn't post your echo. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submit();
    };

    const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            submit();
        }
    };

    if (!user) {
        return (
            <p className="border-b border-line px-4 py-4 text-sm text-muted">
                <Link href="/signin" className="font-medium text-fg underline-offset-4 hover:underline">
                    Sign in
                </Link>{" "}
                to post and like echoes.
            </p>
        );
    }

    const remaining = MAX_LENGTH - text.length;
    const showCounter = remaining <= 40;

    return (
        <div className="flex gap-3 border-b border-line px-4 py-4">
            <Avatar name={user.name} admin={user.role === "admin"} size={40} />

            <form onSubmit={handleSubmit} className="min-w-0 flex-1">
                <label htmlFor="compose" className="sr-only">
                    What’s on your mind?
                </label>
                <textarea
                    id="compose"
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={handleChange}
                    onBlur={stopTyping}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    maxLength={MAX_LENGTH}
                    placeholder="What's on your mind?"
                    className="block max-h-64 w-full resize-none bg-transparent pt-2 text-[17px] leading-6 text-fg outline-none placeholder:text-faint disabled:opacity-60"
                />

                {error && (
                    <p role="alert" className="mt-2 text-sm text-danger">
                        {error}
                    </p>
                )}

                <div className="mt-3 flex items-center justify-end gap-3 border-t border-line pt-3">
                    {showCounter && (
                        <span
                            className={`text-[13px] tabular-nums ${remaining <= 10 ? "text-danger" : "text-muted"}`}
                            aria-live="polite"
                        >
                            {remaining}
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className="inline-flex h-9 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
                    >
                        {loading ? "Posting…" : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
}
