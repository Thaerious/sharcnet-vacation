import Express from "express";
import CONST from "../constants.js";

const router = Express.Router();

router.use(`[/]`,
    (req, res, next) => {        
        if (req.session[CONST.SESSION.LOGGED_IN]) {
            res.redirect("/app");
        } else {
            res.redirect("/google");
        }
    }
);

export default router;