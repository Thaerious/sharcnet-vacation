import Express from "express";
import bodyParser from "body-parser";
import logger from "../../setupLogger.js";
import submitNew from "../../submit_request.js";
import chalk from "chalk";
import requireBody from "../middleware/requireBody.js";
import requireAuth from "../middleware/requireAuth.js";
import dbi from "../../DBInterface.js"
import logMiddleware from "../middleware/logMiddleware.js"

/**
 * Accept a vacation request form submission.
 * Emails the request to the manager (set in requests.db/emails/manager).
 * Emails a confirmation to the staff memeber (received in request).
 * Stores the pending request in requests.db/requests.
 * The request body is json encoded.
 * See doc/vacation_accept.pdf for the 'request body' schema (1).
 * All fields other than 'note' are mandatory.
 */

const submitRoute = Express.Router();

submitRoute.post(
    `/submit`,    
    bodyParser.json(),
    logMiddleware,
    requireAuth,
    requireBody("start_date", "end_date", "name", "institution", "duration"),
    async (req, res) => {
        try {
            const result = await submitNew(req.body);
            dbi.setUserInfo(req.body);
            return res.json(result);
        } catch (error) {
            logger.error(chalk.red(error.stack));
            return res.status(500).json({
                error: error.toString()
            });
        }
    }
);

export default submitRoute;