import Express from "express";
import logger from "../../setupLogger.js";
import chalk from "chalk";
import Path from "path";

const coverageRoute = Express.Router();

coverageRoute.use(`/coverage`, Express.static(Path.resolve(`./coverage`), {
    index: `index.html`
}));

coverageRoute.get(`/coverage`, (req, res, next) => {
    try {
        res.sendFile(Path.resolve(`./coverage/index.html`));
    } catch (error) {
        logger.error(chalk.red(error.stack));
        return res.status(500).json({
            error: error.toString()
        });
    }
});

export { coverageRoute as default }