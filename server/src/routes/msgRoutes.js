const express = require(`express`);
const router = express.Router();
const rateLimit = require(`express-rate-limit`);

const{createMessage, getMessage, deleteMessage, toggleLikeMessage} = require(`../controllers/msgControllers.js`);
const {protect} = require(`../middlewares/authMiddleware.js`);

const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: `Posting too fast. Slow down a little.` }
});

router.get("/", getMessage);
router.post("/", protect, postLimiter, createMessage);
router.delete("/:id", protect, deleteMessage);
router.put("/:id", protect, toggleLikeMessage);

module.exports = router
