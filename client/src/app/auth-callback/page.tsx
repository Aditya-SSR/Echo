"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeGoogleCode } from "../../services/Auth/auth.js";
import { saveToken } from "../../lib/auth.js";

function Status({ text }: { text: string }) {
    return (
        <main className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center gap-4 px-6 text-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-line-strong border-t-fg" aria-hidden="true" />
            <p role="status" className="text-[15px] text-muted">
                {text}
            </p>
        </main>
    );
}

function TokenHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // The code is single-use, so make sure the exchange only runs once
    // (React dev mode runs effects twice).
    const started = useRef(false);

    useEffect(() => {
        if (started.current) return;
        started.current = true;

        const code = searchParams.get("code");
        if (!code) {
            router.push("/signin");
            return;
        }

        exchangeGoogleCode(code)
            .then((data: { token?: string }) => {
                if (!data?.token) throw new Error("No token returned");
                saveToken(data.token);
                window.location.replace("/");
            })
            .catch(() => router.push("/signin"));
    }, [searchParams, router]);

    return <Status text="Signing you in with Google…" />;
}

export default function AuthCallback() {
    return (
        <Suspense fallback={<Status text="Loading…" />}>
            <TokenHandler />
        </Suspense>
    );
}
