const passport = require(`passport`);
const User = require(`../models/User.js`);

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/users/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        
        let user = await User.findOne({ email });

        if (!user) {
        user = await User.create({

        name: profile.displayName,
        email,
        googleId: profile.id,
        provider: "google"

});
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));