import Express from "express";
import CONST from "../constants.js";
import logger from "../setupLogger.js";

// All routes after this require logging in.

const router = Express.Router();

router.use("*",
    async (req, res, next) => {
        if (req.originalUrl.startsWith("/google")) return next();

        if (req.session[CONST?.SESSION?.LOGGED_IN] != true) {
            logger.verbose(`check session redirect ${req.method} ${req.originalUrl}`);
            res.redirect("/google");
        }
        else {
            next();
        }
    }
);

export default router;