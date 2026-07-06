"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin, googleSignIn } from "../../services/Auth/auth";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await signin({ email, password });
            localStorage.setItem("token", data.token);
            router.push("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FAFAF7] px-4 py-12">
            <div className="w-full max-w-md">


                <form
                    onSubmit={handleSubmit}
                    className="w-full border-[3px] border-black bg-white p-8 shadow-[6px_6px_0px_0px_#000]"
                >
                    <h1 className="mb-1 font-sans text-3xl font-black tracking-tight text-black">
                        Sign In
                    </h1>
                    <p className="mb-6 font-mono text-xs uppercase tracking-widest text-black/50">
                        Tune back in to Echo
                    </p>

                    {error && (
                        <div className="mb-4 border-[3px] border-black bg-[#FF3B3B] p-3 font-mono text-xs font-bold text-black">
                            {error}
                        </div>
                    )}

                    <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-black/50">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-4 w-full border-[3px] border-black bg-white p-3 font-mono text-sm text-black outline-none transition-all placeholder:text-black/30 focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5"
                        required
                    />

                    <label className="mb-1.5 block font-mono text-[11px] font-medium uppercase tracking-widest text-black/50">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mb-6 w-full border-[3px] border-black bg-white p-3 font-mono text-sm text-black outline-none transition-all placeholder:text-black/30 focus:shadow-[4px_4px_0px_0px_#000] focus:-translate-x-0.5 focus:-translate-y-0.5"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full border-[3px] border-black bg-[#4EA8DE] py-3 font-mono text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-black hover:text-white active:translate-x-0.5 active:translate-y-0.5 disabled:border-zinc-300 disabled:bg-zinc-200 disabled:text-zinc-500 disabled:hover:bg-zinc-200 disabled:hover:text-zinc-500"
                    >
                        {loading ? "Signing In…" : "Sign In"}
                    </button>

                    <div className="my-6 flex items-center gap-3">
                        <span className="h-0.75 w-full bg-black/10"></span>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-black/40">
                            Or
                        </span>
                        <span className="h-0.75 w-full bg-black/10"></span>
                    </div>

                    <button
                        type="button"
                        onClick={googleSignIn}
                        className="flex w-full items-center justify-center gap-3 border-[3px] border-black bg-white py-3 font-mono text-sm font-bold text-black transition-all hover:shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                fill="#EA4335"
                                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.353 2.682 1.44 6.623l3.826 3.142Z"
                            />
                            <path
                                fill="#4285F4"
                                d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.582h6.455c-.278 1.514-1.123 2.795-2.395 3.655l3.74 2.9A11.838 11.838 0 0 0 23.49 12.275Z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.266 14.235 1.44 17.377A11.956 11.956 0 0 0 12 24c3.205 0 5.9-.995 7.8-2.714l-3.74-2.9a7.086 7.086 0 0 1-4.06 1.223 7.077 7.077 0 0 1-6.734-4.854Z"
                            />
                            <path
                                fill="#34A853"
                                d="M1.44 6.623a11.921 11.921 0 0 0 0 10.754l3.826-3.142a7.03 7.03 0 0 1 0-4.47L1.44 6.623Z"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="mt-6 text-center font-mono text-xs text-black/50">
                        No account yet?{" "}
                        <a href="/signup" className="font-bold text-black underline underline-offset-2">
                            Sign up
                        </a>
                    </p>
                </form>
            </div>
        </main>
    );
}