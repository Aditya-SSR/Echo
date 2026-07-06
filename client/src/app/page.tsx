"use client";

import { useEffect, useState } from "react";
import Message from "../components/Message";
import CreateMessage from "../components/CreateMessage";
import { getMessages } from "../services/Messages/messages.js";
import AutoRefresh from "../components/AutoRefresh.jsx";
import DisclaimerModal from "../components/DisclaimerModal.jsx";

export default function Home() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

 
    const fetchMessages = async () => {
        try {
            const data = await getMessages();
            setMessages(Array.isArray(data) ? data : []);
            setError(false);
        } catch (err) {
            console.error("Frontend Fetch Error:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);


    const sortedMessages = [...messages].sort((a: any, b: any) => {
        const aIsAdmin = a?.user && typeof a.user === "object" && a.user.role === "admin";
        const bIsAdmin = b?.user && typeof b.user === "object" && b.user.role === "admin";
        
        if (aIsAdmin && !bIsAdmin) return -1; 
        if (!aIsAdmin && bIsAdmin) return 1;  
        return 0;                                
    });

    if (error) {
        return (
<main className="flex min-h-screen items-center justify-center bg-white p-6 selection:bg-[#FFD23F]">

    <div 
        className="w-full max-w-xl bg-[#FAFAF7] border-4 border-black 
                   shadow-[12px_12px_0px_0px_#000] p-6 sm:p-8 space-y-6 text-center"
    >

        <div className="flex items-center justify-center gap-2 border-b-[3px] border-black pb-4">
            <span className="h-3 w-3 rounded-full bg-[#FF5D5D] border-2 border-black animate-pulse" />
            <span className="font-mono text-xs font-black tracking-widest text-black/50 uppercase">
                CRITICAL CARRIER LOSS
            </span>
        </div>


        <div className="bg-[#FFD23F] border-[3px] border-black py-4 shadow-[4px_4px_0px_0px_#000]">
            <h1 className="font-sans text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
                SIGNAL DISCONNECTED
            </h1>
        </div>

 
        <div className="space-y-2 font-mono text-sm font-bold text-black text-left bg-black/5 p-4 border-2 border-dashed border-black/20">
            <p className="text-[#FF5D5D]">&gt; ERROR: LINK UNSTABLE OR SERVER DOWN.</p>
            <p className="text-black/60">&gt; Echo uplink transceiver failed to fetch active stream segments from the host matrix.</p>
        </div>


        <div className="pt-2">
            <button
                onClick={() => window.location.reload()}
                className="w-full bg-[#7CE38B] border-[3px] border-black py-3.5 px-4 
                           font-sans text-base font-black uppercase tracking-wider text-black transition-all 
                           hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] 
                           active:translate-x-0 active:translate-y-0 active:shadow-none"
            >
                RE-ESTABLISH UPLINK
            </button>
        </div>
    </div>
</main>
        );
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white p-8 pb-32">
            <div className="mx-auto max-w-2xl">
                <div className="space-y-4">
{sortedMessages.map((message: any) => (
    <Message
        key={message._id}
        message={message}
        setMessages={setMessages}
    />
))}
                </div>
            </div>

            <CreateMessage setMessages={setMessages} /> 
            <AutoRefresh refreshData={fetchMessages} />
            <DisclaimerModal />
        </main>
    );
}