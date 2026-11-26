"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signin, googleSignIn } from "../../services/Auth/auth";
import { saveToken } from "../../lib/auth";
import { AuthShell, Field, ErrorAlert, PrimaryButton, OrDivider, GoogleButton } from "../../components/AuthForm.jsx";

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
            saveToken(data.token);
            router.push("/");
        } catch (err) {
            setError(err.response ? (err.response.data?.message || "Invalid credentials") : "Could not reach the server. It may be waking up - try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell title="Welcome back" subtitle="Sign in to keep posting on Echo.">
            <form onSubmit={handleSubmit}>
                <ErrorAlert>{error}</ErrorAlert>

                <Field
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mb-4"
                />
                <Field
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mb-6"
                />

                <PrimaryButton type="submit" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                </PrimaryButton>

                <OrDivider />

                <GoogleButton onClick={googleSignIn}>Continue with Google</GoogleButton>

                <p className="mt-8 text-center text-sm text-muted">
                    New to Echo?{" "}
                    <Link href="/signup" className="font-medium text-fg underline-offset-4 hover:underline">
                        Create an account
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
