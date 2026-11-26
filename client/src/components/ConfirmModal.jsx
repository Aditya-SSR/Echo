"use client";

import { useEffect, useRef } from "react";

export default function ConfirmModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    destructive = false,
}) {
    const confirmRef = useRef(null);
    const cancelRef = useRef(onCancel);

    useEffect(() => {
        cancelRef.current = onCancel;
    });

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        confirmRef.current?.focus();

        const onKey = (e) => {
            if (e.key === "Escape") cancelRef.current?.();
        };
        document.addEventListener("keydown", onKey);
        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKey);
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/70 p-4 backdrop-blur-[2px] sm:items-center"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onCancel?.();
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                className="w-full max-w-sm animate-pop-in rounded-2xl border border-line-strong bg-raised p-6 shadow-2xl shadow-black"
            >
                <h2 id="confirm-title" className="text-[17px] font-semibold tracking-tight text-fg">
                    {title}
                </h2>
                {message && <p className="mt-2 text-[14px] leading-relaxed text-muted">{message}</p>}

                <div className="mt-6 flex justify-end gap-2">
                    {cancelText && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="h-10 rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors hover:bg-white/8"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        type="button"
                        ref={confirmRef}
                        onClick={onConfirm}
                        className={`h-10 rounded-full px-5 text-sm font-semibold transition-colors ${
                            destructive
                                ? "bg-danger text-black hover:bg-danger/85"
                                : "bg-white text-black hover:bg-white/85"
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
