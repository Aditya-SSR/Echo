// Shared building blocks for the sign-in and sign-up screens.

export function AuthShell({ title, subtitle, children }) {
    return (
        <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-sm flex-col justify-center px-5 py-12">
            <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-fg">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] text-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
        </main>
    );
}

export function Field({ label, id, hint, className = "", ...inputProps }) {
    return (
        <div className={className}>
            <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-muted">
                {label}
            </label>
            <input
                id={id}
                className="h-11 w-full rounded-lg border border-line-strong bg-surface px-3.5 text-[15px] text-fg outline-none transition-colors placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent/30"
                {...inputProps}
            />
            {hint && <p className="mt-1.5 text-xs text-faint">{hint}</p>}
        </div>
    );
}

export function ErrorAlert({ children }) {
    if (!children) return null;
    return (
        <div
            role="alert"
            className="mb-5 rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
        >
            {children}
        </div>
    );
}

export function PrimaryButton({ children, ...props }) {
    return (
        <button
            className="h-11 w-full rounded-lg bg-white text-[15px] font-semibold text-black transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
            {...props}
        >
            {children}
        </button>
    );
}

export function OrDivider() {
    return (
        <div className="my-6 flex items-center gap-3 text-xs text-faint" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
        </div>
    );
}

export function GoogleButton({ onClick, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-line-strong text-[15px] font-medium text-fg transition-colors hover:bg-white/6"
        >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.353 2.682 1.44 6.623l3.826 3.142Z" />
                <path fill="#4285F4" d="M23.49 12.275c0-.818-.073-1.609-.21-2.373H12v4.582h6.455c-.278 1.514-1.123 2.795-2.395 3.655l3.74 2.9A11.838 11.838 0 0 0 23.49 12.275Z" />
                <path fill="#FBBC05" d="M5.266 14.235 1.44 17.377A11.956 11.956 0 0 0 12 24c3.205 0 5.9-.995 7.8-2.714l-3.74-2.9a7.086 7.086 0 0 1-4.06 1.223 7.077 7.077 0 0 1-6.734-4.854Z" />
                <path fill="#34A853" d="M1.44 6.623a11.921 11.921 0 0 0 0 10.754l3.826-3.142a7.03 7.03 0 0 1 0-4.47L1.44 6.623Z" />
            </svg>
            {children}
        </button>
    );
}
