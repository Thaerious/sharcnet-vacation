import Express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import verify from "../verify_google_token.js";
import CONST from "../constants.js";

const router = Express.Router();

router.use('/google_cred_resp$',
    bodyParser.urlencoded({ extended: true }),
    cookieParser(),
    async (req, res) => {
        const payload = await verify(req.body.credential).catch(console.error);
        req.session[CONST.SESSION.LOGGED_IN] = true;
        req.session[CONST.SESSION.EMAIL] = payload.email;
        res.redirect("/app");
    }
);

export default router;
