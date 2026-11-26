const jwt = require(`jsonwebtoken`);
const crypto = require(`crypto`);

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// One-time codes for the Google sign-in redirect. The real JWT never appears
// in a URL: the redirect carries a short-lived, single-use code, and the
// frontend swaps it for a JWT with a POST request.
// Held in memory, so this assumes a single server instance (Render free tier).
const CODE_TTL_MS = 60 * 1000;
const MAX_PENDING_CODES = 1000;
const pendingCodes = new Map();

const sweepExpiredCodes = () => {
    const now = Date.now();
    for (const [code, entry] of pendingCodes) {
        if (entry.expires <= now) pendingCodes.delete(code);
    }
};

const createAuthCode = (userId) => {
    sweepExpiredCodes();
    if (pendingCodes.size >= MAX_PENDING_CODES) {
        pendingCodes.delete(pendingCodes.keys().next().value);
    }
    const code = crypto.randomBytes(32).toString(`hex`);
    pendingCodes.set(code, { userId: String(userId), expires: Date.now() + CODE_TTL_MS });
    return code;
};

// Returns the user id the code was issued for, or null. Always single-use.
const consumeAuthCode = (code) => {
    const entry = pendingCodes.get(code);
    pendingCodes.delete(code);
    if (!entry || entry.expires <= Date.now()) return null;
    return entry.userId;
};

module.exports = { generateToken, createAuthCode, consumeAuthCode };
