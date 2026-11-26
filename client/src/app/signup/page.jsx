"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signup, googleSignIn } from "../../services/Auth/auth";
import { saveToken } from "../../lib/auth";
import { AuthShell, Field, ErrorAlert, PrimaryButton, OrDivider, GoogleButton } from "../../components/AuthForm.jsx";

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
            saveToken(data.token);
            router.push("/");
        } catch (err) {
            setError(err.response ? (err.response.data?.message || "Registration failed. Try again.") : "Could not reach the server. It may be waking up - try again in a moment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthShell title="Create your account" subtitle="Join Echo and start posting.">
            <form onSubmit={handleSubmit}>
                <ErrorAlert>{error}</ErrorAlert>

                <Field
                    id="name"
                    label="Name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={50}
                    required
                    className="mb-4"
                />
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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                    className="mb-6"
                />

                <PrimaryButton type="submit" disabled={loading}>
                    {loading ? "Creating account…" : "Create account"}
                </PrimaryButton>

                <OrDivider />

                <GoogleButton onClick={googleSignIn}>Sign up with Google</GoogleButton>

                <p className="mt-8 text-center text-sm text-muted">
                    Already have an account?{" "}
                    <Link href="/signin" className="font-medium text-fg underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
