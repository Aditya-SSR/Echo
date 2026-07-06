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
            <main className="flex min-h-screen items-center justify-center bg-white">
                <h1 className="text-red-500 text-5xl font-bold text-center p-4">
                    Something went wrong. Cannot fetch messages from the server!
                </h1>
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