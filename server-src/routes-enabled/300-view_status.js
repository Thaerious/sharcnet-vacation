import Express from "express";
import CONST from "../constants.js";
import DBInterface from "../DBInterface.js";
import viewResponseHandler from "../helpers/viewResponseHandler.js";
import { expandDatesInData } from "../helpers/buildData.js";

const router = Express.Router();
const dbi = new DBInterface().open();

router.use(`/status`,
    (req, res, next) => {
        let data = dbi.getRequest(req.query.hash);
        data = expandDatesInData(data);
        data.inst_email = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)[0].email;
        
        res.render(
            "status/index.ejs",
            data,
            viewResponseHandler(res)
        );
    }
);

export default router;