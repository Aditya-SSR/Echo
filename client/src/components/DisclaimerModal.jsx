"use client";

import { useEffect, useState } from "react";

export default function DisclaimerModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {

        const sessionChecked = sessionStorage.getItem("vibe_checked");
        const token = localStorage.getItem("token");

        if (token && !sessionChecked) {
            setIsOpen(true);
        }
    }, []);

    const handleAgree = () => {

        sessionStorage.setItem("vibe_checked", "true");
        setIsOpen(false);
    };

    if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">

        <div 
            className="w-full max-w-lg bg-[#FAFAF7] border-4 border-black 
                       shadow-[10px_10px_0px_0px_#000] animate-in fade-in zoom-in-95 duration-150"
        >
    
            <div className="border-b-4 border-black bg-[#FFD23F] p-4 text-center">
                <h2 className="font-sans text-xl sm:text-2xl font-black uppercase tracking-tight text-black">
                    TRANSMISSION PROTOCOL
                </h2>
            </div>


            <div className="p-6 space-y-4 font-mono text-sm font-bold text-black leading-relaxed">
                <p className="border-l-4 border-[#4EA8DE] pl-3 text-black/80">
                    &gt; Welcome to Echo. This space is built for real-time broadcasting, open channels, and unfiltered ideas.
                </p>
                
     
                <div className="space-y-2 border-[3px] border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
                    <p className="text-xs text-black/40 uppercase tracking-widest font-black">Stream Rules:</p>
                    <p className="text-xs sm:text-sm">&gt; 1. Keep your transmissions respectful to other nodes.</p>
                    <p className="text-xs sm:text-sm">&gt; 2. Avoid posting hostile or destructive signal noise.</p>
                    <p className="text-xs sm:text-sm">&gt; 3. Ensure your content keeps the global frequency healthy.</p>
                </div>

      
                <p className="text-xs text-center text-black/60 font-black tracking-wide pt-2 uppercase">
                     Lynx thanks you for using Echo.
                </p>
            </div>

  
            <div className="p-4 bg-black border-t-4 border-black">
                <button
                    onClick={handleAgree}
                    className="w-full bg-[#7CE38B] border-[3px] border-black py-3 px-4 font-sans text-base font-black uppercase tracking-wider text-black transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#fff] active:translate-x-0 active:translate-y-0 active:shadow-none"
                >
                    I UNDERSTOOD
                </button>
            </div>
        </div>
    </div>
);
}