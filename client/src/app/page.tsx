import Message from "../components/Message";
import CreateMessage from "../components/CreateMessage";
import { getMessages } from "../services/Messages/messages.js";
import AutoRefresh from "../components/AutoRefresh.jsx";
import DisclaimerModal from "../components/DisclaimerModal.jsx";

export default async function Home() {
    try {
        const messages = await getMessages();


        const sortedMessages = Array.isArray(messages)
            ? [...messages].sort((a: any, b: any) => {
                const aIsAdmin = a?.user && typeof a.user === "object" && a.user.role === "admin";
                const bIsAdmin = b?.user && typeof b.user === "object" && b.user.role === "admin";
                
                if (aIsAdmin && !bIsAdmin) return -1; 
                if (!aIsAdmin && bIsAdmin) return 1;  
                return 0;                                 
              })
            : [];

        return (
            <main className="min-h-screen bg-white p-8 pb-32">
                <div className="mx-auto max-w-2xl">
                    <div className="space-y-4">
                        {sortedMessages.map((message: any) => (
                            <Message
                                key={message._id}
                                message={message}
                            />
                        ))}
                    </div>
                </div>

                <CreateMessage /> 
                <AutoRefresh />
                <DisclaimerModal />
            </main>
        );
    } catch (err) {
        console.error("Frontend Render Error:", err);
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <h1 className="text-red-500 text-5xl">
                    Something went wrong. Cannot fetch messages from the server!
                </h1>
            </main>
        );
    }
}