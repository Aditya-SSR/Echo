const User = require(`../models/User.js`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);

const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user._id, 
            name: user.name,
            email: user.email,
            role: user.role
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: '8d' }
    );
};

const registerUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!password){
            return res.status(400).json(`Password is required!!`);
        }
        const userExists = await User.findOne({email : email});
        if(userExists){
            return res.status(400).json(`User already exists`);
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name, email, password : hashPassword
        });
        res.status(200).json({
            msg : "Registration Successfull !!",
            token : generateToken(newUser) 
        });

    } catch(err) {
        res.status(500).json(`Failed to create, error : ${err}`);
    }
};

const loginUser = async(req, res) => {
    try {
        const {name, email, password} = req.body;
        const user = await User.findOne({name : name, email : email});

        if(!user) return res.status(404).json(`USER NOT FOUND`);
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if(!isValid) return res.status(404).json(`INCORRECT PASSWORD`);
    
        res.status(200).json({
            msg : "Login successfull!",
            token : generateToken(user) 
        });

    } catch(err) {
        res.status(500).json(`Failed to login, error : ${err}`);
    }
};

const getUsers = async(req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json(`Fetch unsuccessful error : ${err}`);
    }
};

module.exports = {registerUser, loginUser, getUsers};