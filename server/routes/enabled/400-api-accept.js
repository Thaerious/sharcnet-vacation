import Express from "express";
import logger from "../../setupLogger.js";
import acceptRequest from "../../acceptRequest.js";
import chalk from "chalk";

const acceptRoute = Express.Router();

acceptRoute.get(`/accept`, async (req, res, next) => {
        try {
            await acceptRequest(req.query.hash, req.query.email);
            res.redirect(`/status?hash=${req.query.hash}`);
        } catch (error) {
            logger.error(chalk.red(error.stack));
            return res.status(500).json({
                error: error.toString()
            });
        }
    });

export { acceptRoute as default }
