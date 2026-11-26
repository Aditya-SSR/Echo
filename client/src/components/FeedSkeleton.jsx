"use client";

import { useEffect, useState } from "react";

const ROWS = [
    ["w-full", "w-4/5"],
    ["w-11/12", "w-2/3"],
    ["w-3/4"],
    ["w-full", "w-1/2"],
];

export default function FeedSkeleton() {
    const [slow, setSlow] = useState(false);

    // Free hosting naps when idle, so the first request can take a while. Say so.
    useEffect(() => {
        const timer = setTimeout(() => setSlow(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div aria-busy="true" aria-label="Loading echoes">
            {slow && (
                <p role="status" className="border-b border-line bg-white/[0.03] px-4 py-3 text-sm text-muted">
                    Waking the server up. It naps when nobody’s around, so this can take up to a minute.
                </p>
            )}
            {ROWS.map((lines, i) => (
                <div key={i} className="flex animate-pulse gap-3 border-b border-line px-4 py-4">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-white/8" />
                    <div className="flex-1 space-y-2.5 pt-1">
                        <div className="h-3 w-32 rounded-full bg-white/10" />
                        {lines.map((w, j) => (
                            <div key={j} className={`h-3 rounded-full bg-white/6 ${w}`} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
