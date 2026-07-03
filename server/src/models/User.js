const mongoose = require(`mongoose`);

const userSchema  =  new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Enter Name"]
    },
    email : {
        type : String,
        required : [true, "Enter Email"],
        unique : true,
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
    },
    provider : {
        type : String,
        enum : ["local", "google"],
        default : "local"
    },
    googleId : {
        type : String,
        default : null
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    }

},
{
    timestamps : true
})

const User = mongoose.model('User', userSchema);

module.exports = User;