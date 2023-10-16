import Express from "express";
import bodyParser from "body-parser";
import DBInterface from "../DBInterface.js";
import EMInterface from "../EMInterface.js";
import logger from "../setupLogger.js";
import accept200 from "../responses/accept200.js";
import reject400 from "../responses/reject400.js";
import reject500 from "../responses/reject500.js";
import submitNew from "../functionality/submitNew.js";
import { humanizeDates } from "../helpers/buildData.js";

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
submitRoute.use(bodyParser.urlencoded({ extended: true }));

const dbi = new DBInterface().open();
const emi = new EMInterface();

submitRoute.use(`/submit`, async (req, res, next) => {
    if (!req.body.start_date) reject400(req, res, "missing body parameter: start_date");
    else if (!req.body.end_date) reject400(req, res, "missing body parameter: end_date");
    else if (!req.body.name) reject400(req, res, "missing body parameter: name");
    else if (!req.body.institution) reject400(req, res, "missing body parameter: institution");
    else if (!req.body.email) reject400(req, res, "missing body parameter: email");
    else if (!req.body.duration) reject400(req, res, "missing body parameter: duration");
    else try {
        const data = await submitNew(req.body, dbi, emi);
        accept200(req, res, humanizeDates(data));
        dbi.setUserInfo(req.body);
    } catch (error) {
        logger.error(error.toString());
        console.error(error);
        reject500(req, res, error.toString());
    }
});

submitRoute.on = async (action) => {
    switch (action) {
        case "close":
            dbi.close();
            await emi.wait();
            break;
    }
}

export { submitRoute as default}
