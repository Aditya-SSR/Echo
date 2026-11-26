const { Server } = require(`socket.io`);
const jwt = require(`jsonwebtoken`);

// A typing signal that isn't refreshed within this window is dropped, so a
// lost "stop" event (closed laptop, dead connection) can't leave someone
// "typing" forever. Clients refresh while the user is actually typing.
const TYPING_TTL_MS = 5000;
// Ignore "typing:start" spam from a single connection.
const MIN_START_GAP_MS = 400;

/*
  Real-time events (server -> everyone):
    message:new      the full populated message, same shape as GET /messages items
    message:deleted  { id }
    message:likes    { id, likes }
    typing:update    [{ id, name }]   everyone currently typing

  Client -> server (signed-in users only):
    typing:start     sent while the user types (re-sent every ~2s)
    typing:stop

  The feed is public, so anyone may connect and listen. A valid JWT in the
  handshake (`auth: { token }`) only adds an identity for the typing indicator;
  a missing or invalid token just means "anonymous listener".
*/
function initSockets(server, allowedOrigins) {
    const io = new Server(server, {
        cors: { origin: allowedOrigins, methods: [`GET`, `POST`], credentials: true },
        maxHttpBufferSize: 1e4,
    });

    io.use((socket, next) => {
        socket.data.user = null;
        const token = socket.handshake.auth?.token;
        if (typeof token === `string` && token) {
            try {
                const payload = jwt.verify(token, process.env.JWT_SECRET);
                socket.data.user = {
                    id: String(payload.id),
                    name: String(payload.name || `Someone`).slice(0, 50),
                };
            } catch (err) {
                // Expired or invalid token: continue as an anonymous listener.
            }
        }
        next();
    });

    // socket.id -> { id, name, timer }
    const typers = new Map();

    // One entry per person, even if they're typing in several tabs.
    const snapshot = () => {
        const people = new Map();
        for (const t of typers.values()) people.set(t.id, t.name);
        return [...people].map(([id, name]) => ({ id, name }));
    };

    const publish = () => io.emit(`typing:update`, snapshot());

    const stopTyping = (socketId) => {
        const entry = typers.get(socketId);
        if (!entry) return false;
        clearTimeout(entry.timer);
        typers.delete(socketId);
        return true;
    };

    io.on(`connection`, (socket) => {
        // Bring a newly connected client up to date.
        socket.emit(`typing:update`, snapshot());

        let lastStart = 0;

        socket.on(`typing:start`, () => {
            const user = socket.data.user;
            if (!user) return;

            const now = Date.now();
            if (now - lastStart < MIN_START_GAP_MS) return;
            lastStart = now;

            const existing = typers.get(socket.id);
            if (existing) clearTimeout(existing.timer);

            const timer = setTimeout(() => {
                if (stopTyping(socket.id)) publish();
            }, TYPING_TTL_MS);
            typers.set(socket.id, { ...user, timer });

            // Only tell everyone when the set actually changes.
            if (!existing) publish();
        });

        socket.on(`typing:stop`, () => {
            if (stopTyping(socket.id)) publish();
        });

        socket.on(`disconnect`, () => {
            if (stopTyping(socket.id)) publish();
        });
    });

    return io;
}

module.exports = { initSockets };
