"use client";

import { useCallback, useEffect, useState } from "react";
import Message from "../components/Message";
import CreateMessage from "../components/CreateMessage";
import { getMessages } from "../services/Messages/messages.js";
import DisclaimerModal from "../components/DisclaimerModal.jsx";
import FeedSkeleton from "../components/FeedSkeleton.jsx";
import TypingIndicator from "../components/TypingIndicator.jsx";
import LiveStatus from "../components/LiveStatus.jsx";
import { getSocket } from "../lib/socket.js";
import { useCurrentUser } from "../lib/auth.js";

type Echo = {
    _id: string;
    content: string;
    createdAt: string;
    likes?: unknown[];
    user?: { _id?: string; name?: string; role?: string } | null;
};

export default function Home() {
    const [messages, setMessages] = useState<Echo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const user = useCurrentUser();
    const userId = (user as { id?: string } | null)?.id ?? null;

    const fetchMessages = useCallback(async () => {
        try {
            const data = await getMessages();
            setMessages(Array.isArray(data) ? data : []);
            setError(false);
        } catch (err) {
            console.error("Frontend Fetch Error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Initial data load on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();
    }, [fetchMessages]);

    // Live updates over a WebSocket. Reconnects when the signed-in user changes
    // so the server knows who is typing.
    useEffect(() => {
        const socket = getSocket();
        let firstConnect = true;

        // After a dropped connection we may have missed events, so reload once.
        const onConnect = () => {
            if (!firstConnect) fetchMessages();
            firstConnect = false;
        };
        const onNew = (msg: Echo) =>
            setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [msg, ...prev]));
        const onDeleted = ({ id }: { id: string }) =>
            setMessages((prev) => prev.filter((m) => m._id !== id));
        const onLikes = ({ id, likes }: { id: string; likes: unknown[] }) =>
            setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, likes } : m)));

        socket.on("connect", onConnect);
        socket.on("message:new", onNew);
        socket.on("message:deleted", onDeleted);
        socket.on("message:likes", onLikes);
        socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.off("message:new", onNew);
            socket.off("message:deleted", onDeleted);
            socket.off("message:likes", onLikes);
            socket.disconnect();
        };
    }, [userId, fetchMessages]);

    // Admin posts are pinned to the top of the feed.
    const sortedMessages = [...messages].sort((a, b) => {
        const aIsAdmin = a.user?.role === "admin";
        const bIsAdmin = b.user?.role === "admin";

        if (aIsAdmin && !bIsAdmin) return -1;
        if (!aIsAdmin && bIsAdmin) return 1;
        return 0;
    });

    return (
        <main className="mx-auto min-h-[calc(100dvh-3.5rem)] w-full max-w-2xl border-x border-line">
            {loading ? (
                <FeedSkeleton />
            ) : error && messages.length === 0 ? (
                <div className="px-6 py-24 text-center">
                    <h1 className="text-xl font-semibold tracking-tight text-fg">Can’t reach Echo right now</h1>
                    <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-muted">
                        The server didn’t respond. It may be waking up from a nap, which can take up to a minute.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-6 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <>
                    <LiveStatus />
                    <CreateMessage setMessages={setMessages} />
                    {sortedMessages.length === 0 ? (
                        <div className="px-6 py-20 text-center">
                            <p className="text-[15px] font-semibold text-fg">Nothing here yet</p>
                            <p className="mt-1 text-sm text-muted">Be the first to post an echo.</p>
                        </div>
                    ) : (
                        sortedMessages.map((message) => (
                            <Message key={message._id} message={message} setMessages={setMessages} />
                        ))
                    )}
                </>
            )}
            <TypingIndicator />
            <DisclaimerModal />
        </main>
    );
}
