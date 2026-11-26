"use client";

import { useState, useRef, useEffect } from "react";
import Avatar from "./Avatar.jsx";

export default function UserDetails({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onPointerDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onPointerDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const name = user?.name || "User";
    const email = user?.email || "";
    const isAdmin = user?.role === "admin";

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full ring-offset-2 ring-offset-black transition hover:ring-2 hover:ring-line-strong"
            >
                <Avatar name={name} admin={isAdmin} size={36} />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-11 z-50 w-64 animate-pop-in rounded-xl border border-line-strong bg-raised p-1.5 shadow-2xl shadow-black"
                >
                    <div className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-semibold text-fg">{name}</p>
                            {isAdmin && (
                                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                                    Admin
                                </span>
                            )}
                        </div>
                        {email && <p className="mt-0.5 truncate text-[13px] text-muted">{email}</p>}
                    </div>

                    <div className="my-1 h-px bg-line" />

                    <button
                        type="button"
                        role="menuitem"
                        onClick={onLogout}
                        className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-fg transition-colors hover:bg-white/8"
                    >
                        Log out
                    </button>
                </div>
            )}
        </div>
    );
}
