"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../lib/socket";

// Shows a quiet notice if live updates have been down for a few seconds, so
// nobody stares at a silently stale feed. Hidden while connected.
export default function LiveStatus() {
    const [down, setDown] = useState(false);

    useEffect(() => {
        const socket = getSocket();
        let timer = null;

        const onConnect = () => {
            clearTimeout(timer);
            timer = null;
            setDown(false);
        };
        // Start the countdown once. Failed retries must not keep restarting it.
        const onDrop = () => {
            if (timer) return;
            timer = setTimeout(() => setDown(true), 4000);
        };

        socket.on("connect", onConnect);
        socket.on("disconnect", onDrop);
        socket.on("connect_error", onDrop);
        return () => {
            clearTimeout(timer);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDrop);
            socket.off("connect_error", onDrop);
        };
    }, []);

    if (!down) return null;

    return (
        <p role="status" className="border-b border-line bg-white/[0.03] px-4 py-2.5 text-[13px] text-muted">
            Live updates paused. Reconnecting…
        </p>
    );
}
