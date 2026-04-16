// requireBody.js
import logger from "../../setupLogger.js"
import chalk from "chalk";

// requireBody returns a middleware function pre-loaded with the fields to check.
// The nesting is necessary so the middleware can close over `fields` —
// i.e. remember the required field names at request time, even though
// requireBody() was called earlier during route setup.
//
// Usage — attach directly to the route
// app.post(
//    "/endpoint", 
//    requireBody("start_date", "end_date", "name", "institution", "duration"), 
//    handler
// );
function requireBody(...fields) {
    return function(req, res, next) {
        if (!req.body) {
            logger.error(chalk.red(`missing request body`));
            return res.status(400).json({ error: "missing request body" });
        }

        // Find the first field that is missing or empty
        const missing = fields.find(field => !req.body[field]);
        if (missing) {
            logger.error(chalk.red(`missing body parameter: ${missing}`));
            logger.debug(chalk.red(req.body))
            return res.status(400).json({ error: `missing body parameter: ${missing}` });
        }

        return next();
    };
}

export default requireBody;