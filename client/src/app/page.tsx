"use client";

import { useEffect, useState } from "react";
import Message from "../components/Message";
import CreateMessage from "../components/CreateMessage";
import { getMessages } from "../services/Messages/messages.js";
import AutoRefresh from "../components/AutoRefresh.jsx";
import DisclaimerModal from "../components/DisclaimerModal.jsx";
import FeedSkeleton from "../components/FeedSkeleton.jsx";

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

    const fetchMessages = async () => {
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
    };

    useEffect(() => {
        // Initial data load on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();
    }, []);

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
                    <AutoRefresh refreshData={fetchMessages} />
                </>
            )}
            <DisclaimerModal />
        </main>
    );
}
