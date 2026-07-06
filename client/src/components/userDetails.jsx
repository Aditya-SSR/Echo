"use client";

import { useState, useRef, useEffect } from "react";

export default function UserDetails({ user, onLogout }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <span className="text-sm font-medium text-zinc-300 hidden md:inline">
                {user.name}
            </span>
            

            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-sm font-bold text-white border border-zinc-700 transition hover:border-zinc-400"
            >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </button>


            {dropdownOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl animate-in fade-in duration-200">
                    <div className="mb-3 border-b border-zinc-800 pb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                            Account Details
                        </p>
                        <p className="mt-1 font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-400 truncate">{user.email}</p>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full rounded-lg bg-zinc-900 py-2 text-center text-sm font-medium text-red-400 transition hover:bg-red-950/30 hover:text-red-300"
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}