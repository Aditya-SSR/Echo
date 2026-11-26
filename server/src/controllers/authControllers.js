const User = require(`../models/User.js`);
const bcrypt = require(`bcrypt`);
const { generateToken, consumeAuthCode } = require(`../utils/token.js`);
const { cleanEmail, validateRegistration, isString } = require(`../utils/validate.js`);

// Compared against when the account doesn't exist (or has no password), so a
// failed login takes the same time whether or not the email is registered.
const DUMMY_HASH = bcrypt.hashSync(`not-a-real-password`, 10);

const registerUser = async(req, res) => {
    try {
        const body = req.body ?? {};
        const problem = validateRegistration(body);
        if(problem){
            return res.status(400).json({ message : problem });
        }

        const name = body.name.trim();
        const email = cleanEmail(body.email);

        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({ message : `User already exists` });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(body.password, salt);
        const newUser = await User.create({
            name, email, password : hashPassword
        });
        res.status(201).json({
            msg : "Registration Successfull !!",
            token : generateToken(newUser)
        });

    } catch(err) {
        // Two sign-ups racing on the same email hit the unique index.
        if(err.code === 11000){
            return res.status(400).json({ message : `User already exists` });
        }
        console.error(`Registration failed:`, err);
        res.status(500).json({ message : `Registration failed. Please try again.` });
    }
};

const loginUser = async(req, res) => {
    try {
        const body = req.body ?? {};
        const email = cleanEmail(body.email);
        const password = body.password;

        if(!email || !isString(password) || !password){
            return res.status(400).json({ message : `Email and password are required` });
        }

        const user = await User.findOne({email});

        // Google-only accounts have no password hash; treat them like any
        // other failed login rather than crashing or revealing they exist.
        const isValid = await bcrypt.compare(password, user?.password || DUMMY_HASH);

        if(!user || !user.password || !isValid){
            return res.status(401).json({ message : `Invalid email or password` });
        }

        res.status(200).json({
            msg : "Login successfull!",
            token : generateToken(user)
        });

    } catch(err) {
        console.error(`Login failed:`, err);
        res.status(500).json({ message : `Login failed. Please try again.` });
    }
};

// Admin-only (see routes). Never returns password hashes or Google ids.
const getUsers = async(req, res) => {
    try {
        const users = await User.find().select('-password -googleId');
        res.status(200).json(users);
    } catch(err) {
        console.error(`Fetching users failed:`, err);
        res.status(500).json({ message : `Fetch unsuccessful` });
    }
};

// Swaps the one-time code from the Google redirect for a real JWT.
const exchangeGoogleCode = async(req, res) => {
    try {
        const code = req.body?.code;
        const userId = isString(code) ? consumeAuthCode(code) : null;
        if(!userId){
            return res.status(400).json({ message : `Sign-in link expired. Please try again.` });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ message : `Sign-in link expired. Please try again.` });
        }

        res.status(200).json({ token : generateToken(user) });
    } catch(err) {
        console.error(`Google code exchange failed:`, err);
        res.status(500).json({ message : `Sign-in failed. Please try again.` });
    }
};

module.exports = {registerUser, loginUser, getUsers, exchangeGoogleCode};
