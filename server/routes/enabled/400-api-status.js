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

        const admins = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution);
        if (admins.length == 0) {
            return res.status(500).json({
                error: `No administrators found for ${data.institution}`
            });               
        }

        data.inst_email = admins[0].email;

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
            return res.status(500).json({
                error: `Rendering error`
            });    
        } else {
            res.send(html);
        }
    }
}

export default router;