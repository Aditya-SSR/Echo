require(`dotenv`).config();

// Fail fast with a readable message instead of a cryptic crash later.
const missing = [`MONGODB_URL`, `JWT_SECRET`].filter((key) => !process.env[key]);
if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(`, `)}`);
    console.error(`Copy server/.env.example to server/.env and fill in the values.`);
    process.exit(1);
}

const http = require(`http`);
const express = require(`express`);
const app = express();
app.set("trust proxy", 1);
const passport = require('passport');
const cors = require(`cors`);
const helmet = require(`helmet`);
const rateLimit = require(`express-rate-limit`);
require('./config/passport');


const connectDB = require(`./config/db.js`);
const userRoutes = require(`./routes/authRoutes.js`);
const msgRoutes = require(`./routes/msgRoutes.js`);
const requestLogger = require(`./middlewares/logger.js`);
const { initSockets } = require(`./sockets/index.js`);

const allowedOrigins = [
    'http://localhost:3000',
    'https://echo-frontend-69m5.onrender.com',
    process.env.FRONTEND_URL,
    // Extra allowed origins, comma-separated (e.g. a Vercel domain or a mobile WebView origin)
    ...(process.env.ALLOWED_ORIGINS || ``).split(`,`).map((o) => o.trim().replace(/\/$/, ``))
].filter(Boolean);

// Socket.IO shares the HTTP server (and port) with Express.
const server = http.createServer(app);
const io = initSockets(server, allowedOrigins);
app.set(`io`, io);

app.use(helmet());
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Generous overall cap (the feed polls every 10s); login, register and
// posting have their own much stricter limits in their routes.
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: `Too many requests. Please slow down.` }
}));

app.use(express.json({ limit: `10kb` }));
app.use(passport.initialize());
app.use(requestLogger);


app.use("/users", userRoutes);
app.use("/messages", msgRoutes);

app.use((req, res) => {
    res.status(404).json({ message: `Route not found` });
});

// Catches things like malformed JSON bodies without leaking stack traces.
app.use((err, req, res, next) => {
    const status = err.status || err.statusCode || 500;
    if (status >= 500) console.error(err);
    res.status(status).json({ message: status >= 500 ? `Something went wrong` : `Bad request` });
});


connectDB();

// 8000 matches the client's default API URL. (6000 is also a port browsers block.)
const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
})
