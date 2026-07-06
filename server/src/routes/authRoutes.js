const express = require(`express`);
const router = express.Router();
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);

const {registerUser, loginUser, getUsers} = require(`../controllers/authControllers.js`);


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


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {

        const token = generateToken(req.user);
        
        res.redirect(`http://localhost:3000/auth-callback?token=${token}`);
    }
);


module.exports = router;