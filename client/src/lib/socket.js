import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

let socket = null;

// One shared real-time connection for the whole app. It doesn't connect until
// the feed page calls socket.connect().
export function getSocket() {
    if (!socket) {
        socket = io(API_URL, {
            autoConnect: false,
            transports: ["websocket", "polling"],
            // A function, so every (re)connect picks up the latest sign-in.
            auth: (cb) => cb({ token: localStorage.getItem("token") }),
        });
    }
    return socket;
}
