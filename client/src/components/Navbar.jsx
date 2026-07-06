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


                <a 
                    href="https://github.com/Aditya-SSR/Echo"
                    target="_blank" 
                    rel="noopener noreferrer"
                    title="View Source Protocol"
                    className="flex h-9 w-9 items-center justify-center border-2 border-white bg-black text-white transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:text-black hover:shadow-[3px_3px_0px_0px_#4EA8DE] active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.068.069-.068 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                </a>
            </div>
        </nav>
    );
}