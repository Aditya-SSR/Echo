"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import UserDetails from "./userDetails.jsx";

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
    sessionStorage.removeItem("vibe_checked");
    setUser(null);
    router.refresh();
    router.push("/signin");
};

    return (
        <nav className="relative flex h-16 items-center justify-between border-b-[3px] border-zinc-800 bg-black px-6 sm:px-8 z-50">
  
            <Link 
                href="/" 
                className="font-sans text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase transition-transform active:scale-95"
            >
                Echo<span className="text-[#4EA8DE]">.</span>
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <UserDetails user={user} onLogout={handleLogout} />
                ) : (
                    <div className="flex items-center gap-3">
      
                        <Link
                            href="/signin"
                            className="font-mono text-xs sm:text-sm font-bold uppercase text-white px-3 py-1.5 border-2 border-transparent hover:border-white transition-colors"
                        >
                            Sign In
                        </Link>

                        <Link
                            href="/signup"
                            className="bg-[#FFD23F] font-mono text-xs sm:text-sm font-black uppercase text-black border-[3px] border-black px-4 py-1.5 shadow-[3px_3px_0px_0px_#fff] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#fff] active:translate-x-0 active:translate-y-0 active:shadow-[0px_0px_0px_0px_#fff]"
                        >
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}