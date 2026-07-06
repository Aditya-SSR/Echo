"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import UserDetails from "./userDetails.jsx"

export default function Navbar() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded); 
            } catch (err) {
                console.error("Invalid token:", err);
                localStorage.removeItem("token");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        router.refresh();
        router.push("/signin");
    };

    return (
        <nav className="relative flex h-16 items-center justify-between border-b border-zinc-800 bg-black px-8 z-50">
            <Link href="/" className="text-3xl font-bold tracking-tight text-white">
                Echo
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <UserDetails user={user} onLogout={handleLogout} />
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/signin"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-zinc-200"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}