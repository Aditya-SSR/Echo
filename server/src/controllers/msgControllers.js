const mongoose = require(`mongoose`);
const Message = require(`../models/Message.js`);
const { validateMessageContent } = require(`../utils/validate.js`);

const getMessage = async (req, res) => {
    try {
        const messages = await Message.find()
            .populate('user', 'name role')
            .populate('likes', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json(messages);
    } catch(err) {
        console.error("Backend fetch error:", err);
        res.status(500).json({ message: "Failed to fetch messages!" });
    }
};


const createMessage = async (req, res) => {
    try{
        const content = req.body?.content;

        const problem = validateMessageContent(content);
        if(problem){
            return res.status(400).json({ message : problem });
        }

        const newMsg = await Message.create({
            content,
            user : req.user._id
        });

        // Return the real, populated message so the client can drop it
        // straight into the feed (same shape as GET /messages items).
        await newMsg.populate('user', 'name role');

        req.app.get('io')?.emit('message:new', newMsg);

        res.status(201).json(newMsg);

    }catch(err){
        console.error(`Creating message failed:`, err);
        res.status(500).json({ message : `Creating message failed!` });
    }
}

const deleteMessage = async (req, res) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).json({ message : "Message not found!" });
        }

        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message : "Message not found!" });
        }

        const isOwner = message.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message : "You do not have the permission to delete the message!" });
        }

        await Message.findByIdAndDelete(req.params.id);

        req.app.get('io')?.emit('message:deleted', { id: req.params.id });

        const successMessage = isAdmin && !isOwner
            ? "Post deleted by Creator/Admin successfully!"
            : "Your post was deleted successfully!";

        res.status(200).json({ message : successMessage });

    } catch (err) {
        console.error(`Deleting message failed:`, err);
        res.status(500).json({ message : `Deleting message failed!` });
    }
};

const toggleLikeMessage = async(req, res) => {
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(404).json({ message : `Message not found!` });
        }

        const message = await Message.findById(req.params.id);
        if(!message) return res.status(404).json({ message : `Message not found!` });

        const hasLiked = message.likes.includes(req.user._id);

        const update = hasLiked
            ? { $pull: { likes: req.user._id } }
            : { $addToSet: { likes: req.user._id } };

        const updated = await Message.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate('likes', 'name');

        // Tell every open feed the new like list (same shape as GET /messages).
        if(updated){
            req.app.get('io')?.emit('message:likes', { id: req.params.id, likes: updated.likes });
        }

        res.status(200).json({ message : hasLiked ? "Message unliked!" : `Message Liked!` });

    }catch(err){
        console.error(`Like toggle failed:`, err);
        res.status(500).json({ message : `Failed to like message.` });
    }
}

module.exports = {createMessage, getMessage, deleteMessage, toggleLikeMessage};
