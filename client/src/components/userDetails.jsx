"use client";

import { useState, useRef, useEffect } from "react";

const STAMP_COLORS = [
    "#FF5D5D", 
    "#FFD23F", 
    "#4EA8DE", 
    "#7CE38B", 
    "#C77DFF", 
    "#FF9F1C", 
];

function getStampColor(name) {
    const initial = (name || "?").trim().charAt(0).toUpperCase();
    const code = initial.charCodeAt(0) || 0;
    return STAMP_COLORS[code % STAMP_COLORS.length];
}

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

    const name = user?.name || "User";
    const email = user?.email || "";
    

    const isAdminUser = user?.role === "admin";
    const stampColor = getStampColor(name);

    return (
        <div className="relative flex items-center gap-3" ref={dropdownRef}>
            <span 
                className="hidden md:inline font-mono text-xs sm:text-sm font-black uppercase tracking-tight text-black border-[3px] border-black bg-[#FAFAF7] px-2.5 py-1 shadow-[3px_3px_0px_0px_#fff]"
                style={{ outlineColor: stampColor }}
            >
                {name}
            </span>

            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-10 w-10 shrink-0 items-center justify-center border-[3px] border-black transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#fff] focus:outline-none overflow-hidden"
                style={{ backgroundColor: stampColor }}
            >
                {isAdminUser ? (
                    <img 
                        src="/Lynxx.png" 
                        alt={name} 
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="font-sans text-base font-black text-black">
                        {name.charAt(0).toUpperCase()}
                    </span>
                )}
            </button>

            {dropdownOpen && (
                <div 
                    className="absolute right-0 top-12 w-64 bg-[#FAFAF7] border-[3px] border-black p-4 
                               shadow-[6px_6px_0px_0px_#fff] animate-in fade-in zoom-in-95 duration-100 z-50"
                >
                    <div className="mb-4 border-b-[3px] border-dashed border-black/20 pb-3">
                        <p className="font-mono text-[10px] font-black uppercase tracking-wider text-black/40">
                            CLUSTER NODE ID ({user?.role || "USER"})
                        </p>
                        <p className="mt-1 font-sans text-base font-black text-black truncate">
                            {name}
                        </p>
                        {email && (
                            <p className="font-mono text-xs font-medium text-black/60 truncate mt-0.5">
                                {email}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full border-[3px] border-black bg-[#FF5D5D] py-2 text-center font-mono text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#FF3B3B] active:translate-x-0.5 active:translate-y-0.5"
                    >
                        TERMINATE SESSION
                    </button>
                </div>
            )}
        </div>
    );
}