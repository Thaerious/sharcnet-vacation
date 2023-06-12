import Express from "express";
import CONST from "../constants.js";

// All routes after this require logging in.

const router = Express.Router();

router.use("/logout$",
    async (req, res, next) => {
        req.session[CONST?.SESSION?.LOGGED_IN] = false;
        res.redirect("/google");
    }
);

export default router;