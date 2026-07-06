"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signin, googleSignIn} from "../../services/Auth/auth";

export default function SignUp() {
    const [name, setName] = useState("");
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
            const data = await signup({ name, email, password });
            localStorage.setItem("token", data.token); 
            router.push("/"); 
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <form 
                onSubmit={handleSubmit} 
                className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow"
            >
                <h1 className="mb-6 text-3xl font-bold tracking-tight">Create Account</h1>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4 w-full rounded-lg border p-3 outline-none transition focus:border-black"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mb-4 w-full rounded-lg border p-3 outline-none transition focus:border-black"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-6 w-full rounded-lg border p-3 outline-none transition focus:border-black"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-black py-3 font-medium text-white transition hover:bg-gray-800 disabled:bg-gray-400"
                >
                    {loading ? "Creating Account..." : "Sign Up"}
                </button>

                <div className="my-6 flex items-center justify-between">
                    <span className="h-px w-full bg-gray-200"></span>
                    <span className="px-3 text-xs uppercase text-gray-400 font-medium">or</span>
                    <span className="h-px w-full bg-gray-200"></span>
                </div>

                <button
                    type="button"
                    onClick={googleSignIn}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.353 2.682 1.44 6.623l3.826 3.142Z"/>
                        <path fill="#4285F4" d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.582h6.455c-.278 1.514-1.123 2.795-2.395 3.655l3.74 2.9A11.838 11.838 0 0 0 23.49 12.275Z"/>
                        <path fill="#FBBC05" d="M5.266 14.235 1.44 17.377A11.956 11.956 0 0 0 12 24c3.205 0 5.9-.995 7.8-2.714l-3.74-2.9a7.086 7.086 0 0 1-4.06 1.223 7.077 7.077 0 0 1-6.734-4.854Z"/>
                        <path fill="#34A853" d="M1.44 6.623a11.921 11.921 0 0 0 0 10.754l3.826-3.142a7.03 7.03 0 0 1 0-4.47L1.44 6.623Z"/>
                    </svg>
                    Sign Up with Google
                </button>
            </form>
        </main>
    );
}