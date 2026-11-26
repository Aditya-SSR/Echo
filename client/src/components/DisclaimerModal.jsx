"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useCurrentUser } from "../lib/auth";

const RULES = [
    "Be respectful to the people you talk to.",
    "No hateful, hostile or spammy posts.",
    "Keep it a place you'd want to hang out in.",
];

const noopSubscribe = () => () => {};
const readSeen = () => sessionStorage.getItem("vibe_checked") === "true";

export default function DisclaimerModal() {
    const user = useCurrentUser();
    const [dismissed, setDismissed] = useState(false);
    // sessionStorage doesn't exist during SSR, so the server snapshot says "already seen".
    const seen = useSyncExternalStore(noopSubscribe, readSeen, () => true);

    const isOpen = !!user && !seen && !dismissed;

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    const handleAgree = () => {
        sessionStorage.setItem("vibe_checked", "true");
        setDismissed(true);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/75 p-4 backdrop-blur-[2px] sm:items-center">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="guidelines-title"
                className="w-full max-w-md animate-pop-in rounded-2xl border border-line-strong bg-raised p-6 shadow-2xl shadow-black"
            >
                <h2 id="guidelines-title" className="text-xl font-semibold tracking-tight text-fg">
                    Welcome to Echo
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    A simple place to share what’s on your mind. A few ground rules keep it that way:
                </p>

                <ol className="mt-5 space-y-3">
                    {RULES.map((rule, i) => (
                        <li key={rule} className="flex items-start gap-3 text-[15px] leading-6 text-fg">
                            <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-medium tabular-nums text-muted">
                                {i + 1}
                            </span>
                            {rule}
                        </li>
                    ))}
                </ol>

                <button
                    type="button"
                    autoFocus
                    onClick={handleAgree}
                    className="mt-7 h-11 w-full rounded-full bg-white text-[15px] font-semibold text-black transition-colors hover:bg-white/85"
                >
                    I understand
                </button>
                <p className="mt-4 text-center text-xs text-faint">Echo by Lynx</p>
            </div>
        </div>
    );
}
