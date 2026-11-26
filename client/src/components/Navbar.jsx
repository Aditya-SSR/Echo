"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDetails from "./userDetails.jsx";
import { useCurrentUser, clearToken } from "../lib/auth";

export default function Navbar() {
    const user = useCurrentUser();
    const router = useRouter();

    const handleLogout = () => {
        clearToken();
        router.refresh();
        router.push("/signin");
    };

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-black/80 backdrop-blur-md">
            <nav className="mx-auto flex h-14 w-full max-w-2xl items-center justify-between px-4">

                <Link
                    href="/"
                    className="font-sans text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase transition-transform active:scale-95"
                >
                    Echo<span className="text-[#4EA8DE]">.</span>
                </Link>

                <div className="flex items-center gap-1.5">
                    {user ? (
                        <UserDetails user={user} onLogout={handleLogout} />
                    ) : (
                        <>
                            <Link
                                href="/signin"
                                className="inline-flex h-9 items-center rounded-full px-3.5 text-sm font-medium text-muted transition-colors hover:text-fg"
                            >
                                Sign in
                            </Link>
                            <Link
                                href="/signup"
                                className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/85"
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    <a
                        href="https://github.com/Aditya-SSR/Echo"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Echo on GitHub"
                        className="ml-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-fg"
                    >
                        <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.48,0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.068.069-.068 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                    </a>
                </div>
            </nav>
        </header>
    );
}
