const jwt = require(`jsonwebtoken`);
const User = require(`../models/User.js`);

async function protect(req, res, next){
    const header = req.headers.authorization;

    if(!header || !header.startsWith(`Bearer `)){
        return res.status(401).json({ message : `Not authorised, no token provided` });
    }

    try{
        const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        // Token is valid but the account no longer exists.
        if(!user){
            return res.status(401).json({ message : `Not authorised, user no longer exists` });
        }

        req.user = user;
    }catch(err){
        return res.status(401).json({ message : `Not authorised, token invalid or expired` });
    }

    next();
}

function adminOnly(req, res, next){
    if(req.user && req.user.role === `admin`){
        return next();
    }
    return res.status(403).json({ message : `Admin access required` });
}

module.exports = {protect, adminOnly};
