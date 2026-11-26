"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";
import { useCurrentUser } from "../lib/auth";

function describe(names) {
    if (names.length === 1) return { who: names[0], verb: "is typing" };
    if (names.length === 2) return { who: `${names[0]} and ${names[1]}`, verb: "are typing" };
    return { who: "Several people", verb: "are typing" };
}

// A small pill at the bottom of the screen. It floats, so it never shifts the feed.
export default function TypingIndicator() {
    const user = useCurrentUser();
    const [typers, setTypers] = useState([]);

    useEffect(() => {
        const socket = getSocket();
        const onUpdate = (list) => setTypers(Array.isArray(list) ? list : []);
        const onDisconnect = () => setTypers([]);

        socket.on("typing:update", onUpdate);
        socket.on("disconnect", onDisconnect);
        return () => {
            socket.off("typing:update", onUpdate);
            socket.off("disconnect", onDisconnect);
        };
    }, []);

    const names = typers.filter((t) => t.id !== user?.id).map((t) => t.name);
    const { who, verb } = describe(names);

    return (
        <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-center px-4"
        >
            {names.length > 0 && (
                <div className="flex max-w-full animate-pop-in items-center gap-2.5 rounded-full border border-line-strong bg-raised/95 py-2 pl-3.5 pr-4 text-[13px] text-muted shadow-lg shadow-black/60">
                    <span className="flex items-center gap-0.5" aria-hidden="true">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:120ms]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:240ms]" />
                    </span>
                    <span className="truncate">
                        <span className="font-medium text-fg">{who}</span> {verb}
                    </span>
                </div>
            )}
        </div>
    );
}
