"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-white p-6 selection:bg-[#FFD23F]">

            <div 
                className="w-full max-w-xl bg-[#FAFAF7] border-4 border-black 
                           shadow-[12px_12px_0px_0px_#000] p-6 sm:p-8 space-y-6"
            >

                <div className="flex items-center gap-2 border-b-[3px] border-black pb-4">
                    <span className="h-3 w-3 rounded-full bg-[#FF5D5D] border-2 border-black" />
                    <span className="h-3 w-3 rounded-full bg-[#FFD23F] border-2 border-black" />
                    <span className="h-3 w-3 rounded-full bg-[#7CE38B] border-2 border-black" />
                    <span className="font-mono text-[11px] font-black tracking-widest text-black/40 ml-auto uppercase">
                        CRITICAL SIGNAL FAULT
                    </span>
                </div>

                <div className="bg-[#FF5D5D] border-[3px] border-black py-6 text-center shadow-[4px_4px_0px_0px_#000]">
                    <h1 className="font-sans text-6xl sm:text-7xl font-black tracking-tighter text-black select-none">
                        404
                    </h1>
                </div>


                <div className="space-y-3 font-mono text-sm font-bold text-black leading-relaxed">
                    <p className="border-l-4 border-[#4EA8DE] pl-3 text-black/80">
                        &gt; TARGET LOCATION DROPPED FROM TRANSCEIVER MATRIX.
                    </p>
                    <p className="text-black/60 bg-black/5 p-3 border-2 border-dashed border-black/20 text-xs sm:text-sm">
                        The resource path you requested does not map to any active stream endpoints inside the Echo grid.
                    </p>
                </div>


                <div className="pt-2">
                    <Link
                        href="/"
                        className="block w-full text-center bg-[#7CE38B] border-[3px] border-black py-3.5 px-4 
                                   font-sans text-base font-black uppercase tracking-wider text-black transition-all 
                                   hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] 
                                   active:translate-x-0 active:translate-y-0 active:shadow-none"
                    >
                        RETURN TO MAIN STREAM
                    </Link>
                </div>
            </div>

     
            <p className="mt-8 font-mono text-[10px] font-black uppercase tracking-widest text-black/30">
                System Framework: Echo Pipeline v1.0
            </p>
        </main>
    );
}