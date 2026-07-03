const express = require(`express`);
const router = express.Router();


const{createMessage, getMessage, deleteMessage, toggleLikeMessage} = require(`../controllers/msgControllers.js`);
const {protect} = require(`../middlewares/authMiddleware.js`);

router.get("/", getMessage);
router.post("/", protect, createMessage);
router.delete("/:id", protect, deleteMessage);
router.put("/:id", protect, toggleLikeMessage);

module.exports = router
