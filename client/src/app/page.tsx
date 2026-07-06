import Message from "../components/Message";
import CreateMessage from "../components/CreateMessage";
import { getMessages } from "../services/Messages/messages.js";
import AutoRefresh from "../components/AutoRefresh.jsx";

export default async function Home() {
    try {
        const messages = await getMessages();

        return (
            <main className="min-h-screen bg-white p-8 pb-32">
                <div className="mx-auto max-w-2xl">
                    <div className="space-y-4">
                        {messages.map((message : any) => (
                            <Message
                                key={message._id}
                                message={message}
                            />
                        ))}
                    </div>
                </div>

                <CreateMessage /> 
                <AutoRefresh />
            </main>
        );
    } catch (err) {
        console.error(err);
        return (
            <main className="flex min-h-screen items-center justify-center bg-white">
                <h1 className="text-red-500 text-5xl">
                    Something went wrong. Cannot fetch messages from the server!
                </h1>
            </main>
        );
    }
}