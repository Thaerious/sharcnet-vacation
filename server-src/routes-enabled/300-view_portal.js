import Express from "express";
import CONST from "../constants.js";
import DBInterface from "../DBInterface.js";
import catchRenderingError from "../helpers/catchRenderingError.js";

const router = Express.Router();
const dbi = new DBInterface().open();

router.use(`/app`,
    ifLoggedIn,
    renderIndex,
);

function ifLoggedIn(req, res, next) {
    if (req.session[CONST?.SESSION?.LOGGED_IN] != true) {
        res.redirect(CONST.LOC.ENDPOINTS.GOOGLE);
    }
    else {
        next();
    }
}

function renderIndex(req, res, next) {        
    const data = {
        ...dbi.getUserInfo(req.session[CONST.SESSION.EMAIL]),
        client_id: process.env.CLIENT_ID
    }

    res.render(
        "vacation-app/index/index.ejs",
        data,
        catchRenderingError(res)
    );
}

export default router;