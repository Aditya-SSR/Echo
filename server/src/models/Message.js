const mongoose = require(`mongoose`);

const messageSchema = new mongoose.Schema({
    content : {
        type : String,
        required : [true, "Message cannot be empty"],
        trim : true
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    likes : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    ]
},{
    timestamps : true
})

module.exports = mongoose.model('Message', messageSchema)