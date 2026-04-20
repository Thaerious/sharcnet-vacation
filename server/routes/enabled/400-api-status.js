import Express from "express";
import CONST from "../../constants.js";
import dbi from "../../DBInterface.js";
import { expandDatesInRecord, humanizeDates } from "../../buildData.js";
import logger from "../../setupLogger.js"
import chalk from "chalk"

const router = Express.Router();

router.use(`/status`,
    (req, res, next) => {
        if (!req.query.hash) {
            logger.error(chalk.red("missing url parameter: hash"));
            return res.status(400).json({
                error: "missing url parameter: hash"
            });            
        }

        let data = dbi.getRequestByHash(req.query.hash);
        if (!data) {
            logger.error(chalk.red(`Invalid hash (${req.query.hash}), no data found`));
            return res.status(400).json({
                error: `Invalid hash (${req.query.hash}), no data found`
            });                 
        }

        data = expandDatesInRecord(data);
        data = humanizeDates(data);
        data.inst_email = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)[0].email;

        res.render(
            "status/index.ejs",
            data,
            catchRenderingError(res)
        );
    }
);

function catchRenderingError(res) {
    return (err, html) => {
        if (err) {
            logger.error(err);
            throw new Error(err);
        } else {
            res.send(html);
        }
    }
}

export default router;