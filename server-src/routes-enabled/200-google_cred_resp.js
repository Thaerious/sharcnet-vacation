import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import verify from "../verifyGoogleToken.js";
import CONST from "../constants.js";
import DBInterface from "../DBInterface.js";

const dbi = new DBInterface().open();
const router = Express.Router();

router.use('/google_cred_resp$',
    bodyParser.urlencoded({ extended: true }),
    cookieParser(),
    async (req, res) => {
        const payload = await verify(req.body.credential).catch(console.error);
        req.session[CONST.SESSION.LOGGED_IN] = true;
        req.session[CONST.SESSION.EMAIL] = payload.email;
        res.redirect("/app");

        if (!dbi.hasUserInfo(payload.email)){
            dbi.setUserInfo({
                email: payload.email,
                name: payload.name,
                institution: ""
            })
        };
    }
);

export default router;
