import Express from "express";
import bodyParser from "body-parser";
import GoogleCalendar from "../GoogleCalendar.js";
import constants from "../constants.js";
import DBInterface from "../DBInterface.js";
import EMInterface from "../EMInterface.js";
import logger from "../setupLogger.js";
import reject400 from "../reject400.js";
import reject500 from "../reject500.js";
import submitNew from "../functionality/submitNew.js";

/**
 * Accept a vacation request form submission.
 * Emails the request to the manager (set in requests.db/emails/manager).
 * Emails a confirmation to the staff memeber (received in request).
 * Stores the pending request in requests.db/requests.
 * The request body is json encoded.
 * See doc/vacation_accept.pdf for the 'request body' schema (1).
 * All fields other than 'note' are mandatory.
 */ 
class SubmitHandler {
    constructor() {
        this.googleCalendar = new GoogleCalendar();
        this.route = Express.Router();
        this.route.use(bodyParser.urlencoded({ extended: true }));
        this.dbi = new DBInterface().open();
        this.emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

        this.route.post(`/submit`, async (req, res, next) => {
            if (!req.body.start_date) reject400(req, res, "missing body parameter: start_date");
            if (!req.body.end_date) reject400(req, res, "missing body parameter: end_date");            
            if (!req.body.name) reject400(req, res, "missing body parameter: name");            
            if (!req.body.institution) reject400(req, res, "missing body parameter: institution");            
            if (!req.body.email) reject400(req, res, "missing body parameter: email");            
            if (!req.body.term) reject400(req, res, "missing body parameter: term");
                        
            try {
                await submitNew(req.body, dbi, emi);
                res.redirect(constants.loc.endpoint.SUBMIT);
                res.end();
            } catch (error) {
                logger.error(error.toString());
                console.error(error);
                reject500(req, res, error.toString());
            }
        });
    }

    async load() {
        await this.googleCalendar.insert(process.env.CALENDAR_ID);
        return this;
    }
}

export default SubmitHandler;
