import Express from "express";
import CONST from "../constants.js";
import DBInterface from "../DBInterface.js";
import catchRenderingError from "../helpers/catchRenderingError.js";
import { expandDatesInData, humanizeDates } from "../helpers/buildData.js";
import reject400 from "../responses/reject400.js";

const router = Express.Router();
const dbi = new DBInterface().open();

router.use(`/status`,
    (req, res, next) => {
        if (!req.query.hash) {
            reject400(req, res, "missing url parameter: hash");
            return;
        }

        let data = dbi.getRequestByHash(req.query.hash);
        if (!data) {
            reject400(req, res, `Invalid hash (${req.query.hash}), no data found`);
            return;
        }

        data = expandDatesInData(data);
        data = humanizeDates(data);
        data.inst_email = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)[0].email;

        res.render(
            "status/index.ejs",
            data,
            catchRenderingError(res)
        );
    }
);

export default router;