const Message = require(`../models/Message.js`);

const getMessage = async (req, res) => {
    try{
        
        const Messages = await Message.find()
        .populate('user', "name")
        .populate('likes', 'name')
        .sort({ createdAt: -1 });
        res.status(200).json(Messages);

    }catch(err){
        res.status(500).json(`Failed to fetch messages!`);
    }
}


const createMessage = async (req, res) => {
    try{
        const {content} = req.body;
        
        const newMsg = await Message.create({
            content, 
            user : req.user._id
        })

        res.status(200).json(`Msg created Successfully!`);


    }catch(err){
        res.status(400).json(`Creating message failed! error ${err}`);
    }
}

const deleteMessage = async (req, res) => {
    try {

        const message = await Message.findById(req.params.id);


        if (!message) {
            return res.status(404).json("Message not found!");
        }

        const isOwner = message.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";


        if (!isOwner && !isAdmin) {
            return res.status(403).json("You do not have the permission to delete the message!");
        }

        await Message.findByIdAndDelete(req.params.id);
        
        const successMessage = isAdmin && !isOwner 
            ? "Post deleted by Creator/Admin successfully!" 
            : "Your post was deleted successfully!";

        res.status(200).json(successMessage);

    } catch (err) {
        res.status(500).json(`Deleting message failed!! error : ${err.message}`);
    }
};

const toggleLikeMessage = async(req, res) => {
    try{
        const message = await Message.findById(req.params.id);
        if(!message) return res.status(404).json(`Message not found!`);

        const hasLiked = message.likes.includes(req.user._id);

        if(!hasLiked){
            await Message.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } });
            res.status(200).json(`Message Liked!`);
        }else{
            await Message.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } });
            res.status(200).json("Message unliked!");
        }



    }catch(err){
        res.status(500).json(`Failed to like message. Error : ${err}`);
    }
}





module.exports = {createMessage, getMessage, deleteMessage, toggleLikeMessage};