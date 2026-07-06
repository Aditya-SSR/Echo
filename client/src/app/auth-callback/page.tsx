"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function TokenHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("token", token);
            window.location.href = "/";
        } else {
            router.push("/signin");
        }
    }, [searchParams, router]);

    return (
        <div className="w-full max-w-md bg-[#FAFAF7] border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_#000]">

            <div className="mb-4 inline-block bg-[#FFD23F] border-2 border-black px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-black animate-pulse">
                INITIALIZING HANDSHAKE
            </div>

            <h1 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-black leading-none">
                Authenticating with Google
            </h1>
            
     
            <div className="my-4 border-t-[3px] border-dashed border-black/20" />

            <div className="flex items-center gap-3 bg-black p-3 text-left font-mono text-xs text-[#7CE38B]">
                <span className="text-white/30 shrink-0">&gt;</span>
                <p className="truncate animate-pulse">
                    Syncing matrix tokens with server node cluster...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-white p-6">
            <Suspense 
                fallback={
                    <div className="bg-[#FAFAF7] border-[3px] border-black p-6 font-mono text-xs font-black text-black shadow-[6px_6px_0px_0px_#000] uppercase tracking-widest animate-pulse">
                        &gt; Fetching Client Manifest...
                    </div>
                }
            >
                <TokenHandler />
            </Suspense>
        </main>
    );
}