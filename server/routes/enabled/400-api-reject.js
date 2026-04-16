import Express from "express";
import logger from "../../setupLogger.js";
import rejectRequest from "../../rejectRequest.js";
import chalk from "chalk";

const rejectRoute = Express.Router();

rejectRoute.use(`/reject`, async (req, res, next) => {
    try {
        rejectRequest(req.query.hash, req.query.email, req.body);
        res.redirect(`/status?hash=${req.query.hash}`);
    } catch (error) {
        logger.error(chalk.red(error.stack));
        return res.status(500).json({
            error: error.toString()
        });
    }
});

export { rejectRoute as default }

