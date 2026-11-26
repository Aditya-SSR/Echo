const express = require(`express`);
const router = express.Router();
const passport = require(`passport`);
const rateLimit = require(`express-rate-limit`);

const {registerUser, loginUser, getUsers, exchangeGoogleCode} = require(`../controllers/authControllers.js`);
const {protect, adminOnly} = require(`../middlewares/authMiddleware.js`);
const {createAuthCode} = require(`../utils/token.js`);
const {googleEnabled} = require(`../config/passport.js`);

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// Brute-force protection for everything that can mint a token.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: `Too many attempts. Please try again in a few minutes.` }
});

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.get("/", protect, adminOnly, getUsers);

if (googleEnabled) {
    router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

    router.get('/google/callback',
        passport.authenticate('google', { failureRedirect: `${frontendUrl}/signin`, session: false }),
        (req, res) => {
            // Never put the JWT in the URL - hand over a one-time code instead.
            const code = createAuthCode(req.user._id);
            res.redirect(`${frontendUrl}/auth-callback?code=${code}`);
        }
    );
} else {
    router.get('/google', (req, res) => {
        res.status(503).json({ message : `Google sign-in is not configured on this server` });
    });
}

router.post('/google/exchange', authLimiter, exchangeGoogleCode);

module.exports = router;
