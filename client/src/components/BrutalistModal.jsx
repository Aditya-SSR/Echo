"use client";

import { useEffect } from "react";

export default function BrutalistModal({ 
    isOpen, 
    title = "ALERT", 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "YES, PROCEED", 
    cancelText = "CANCEL" 
}) {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">

            <div 
                className="w-full max-w-md bg-[#FAFAF7] border-[3px] border-black 
                           shadow-[8px_8px_0px_0px_#000] animate-in fade-in zoom-in-95 duration-100"
            >
  
                <div className="flex items-center justify-between border-b-[3px] border-black bg-[#FF5D5D] p-3">
                    <h3 className="font-sans text-sm font-black uppercase tracking-wider text-black flex items-center gap-2">
                        <span className="text-base">⚠️</span> {title}
                    </h3>
                    <button 
                        onClick={onCancel}
                        className="flex h-6 w-6 items-center justify-center border-2 border-black bg-white text-xs font-black transition-colors hover:bg-black hover:text-white"
                    >
                        ✕
                    </button>
                </div>

  
                <div className="p-6">
                    <p className="font-mono text-sm sm:text-base font-bold leading-relaxed text-black">
                        {message}
                    </p>
                </div>


                <div className="flex border-t-[3px] border-black bg-black gap-0.75">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-white px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#FFD23F] active:translate-x-0.5 active:translate-y-0.5"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-[#FF3B3B] px-4 py-3 font-mono text-xs font-black uppercase tracking-wider text-black transition-colors hover:bg-[#e02424] active:translate-x-0.5 active:translate-y-0.5"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}