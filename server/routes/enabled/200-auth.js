import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dbi from "../../DBInterface.js";

const router = express.Router();

passport.use(
    new GoogleStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    (_accessToken, _refreshToken, profile, done) => {
        let email = profile.emails[0].value        
        let institution = ""

        if (dbi.hasUserInfo(email)){
            institution = dbi.getUserInfo(email).institution
        }

        const user = {
            id: profile.id,
            name: profile.displayName,
            email: email,
            photo: profile.photos?.[0]?.value,
            institution: institution
        };
        return done(null, user);
    })
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

router.get("/auth/login",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/auth/callback",
    passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
        res.redirect("/");
});

router.get("/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect("/");
    });
});

export default router;