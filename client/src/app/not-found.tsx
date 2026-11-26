import Link from "next/link";

export default function NotFound() {
    return (
        <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-md flex-col items-center justify-center px-6 text-center">
            <p className="text-sm font-medium tabular-nums text-accent">404</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-fg">This page doesn’t exist</h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
                The link may be broken, or the page may have been removed.
            </p>
            <Link
                href="/"
                className="mt-8 inline-flex h-10 items-center rounded-full bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-white/85"
            >
                Back to the feed
            </Link>
        </main>
    );
}
