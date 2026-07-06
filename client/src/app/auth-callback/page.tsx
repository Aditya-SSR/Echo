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
        <div className="text-center">
            <h1 className="text-xl font-medium tracking-tight">Authenticating with Google...</h1>
            <p className="mt-2 text-sm text-zinc-400">Syncing your session, please wait.</p>
        </div>
    );
}

export default function AuthCallback() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-black text-white">
            <Suspense fallback={<p>Loading...</p>}>
                <TokenHandler />
            </Suspense>
        </main>
    );
}