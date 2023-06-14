import Express from "express";
import CONST from "../constants.js";
import DBInterface from "../DBInterface.js";
import viewResponseHandler from "../helpers/viewResponseHandler.js";
import checkLoggedIn from "../helpers/checkLoggedIn.js";

const router = Express.Router();
const dbi = new DBInterface().open();

router.use(`/app`,
    checkLoggedIn,
    (req, res, next) => {        
        const data = {
            ...dbi.getUserInfo(req.session[CONST.SESSION.EMAIL]),
            client_id: process.env.CLIENT_ID
        }

        res.render(
            "vacation-app/index/index.ejs",
            data,
            viewResponseHandler(res)
        );
    }
);

export default router;