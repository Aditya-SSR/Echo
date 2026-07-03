const express = require(`express`);
const router = express.Router();
const passport = require(`passport`);
const jwt = require(`jsonwebtoken`);

const {registerUser, loginUser, getUsers} = require(`../controllers/authControllers.js`);


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));


router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {

        const token = generateToken(req.user._id);
        
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            token: token
        });
    }
);


module.exports = router;