import Express from "express";
import bodyParser from "body-parser";
import GoogleCalendar from "../GoogleCalendar.js";
import constants from "../constants.js";
import DBInterface from "../DBInterface.js";
import EMInterface from "../EMInterface.js";
import logger from "../setupLogger.js";
import reject400 from "../reject400.js";
import reject500 from "../reject500.js";

class SubmitHandler {
    constructor() {
        this.googleCalendar = new GoogleCalendar();
        this.route = Express.Router();
        this.route.use(bodyParser.urlencoded({ extended: true }));
        this.dbi = new DBInterface().open();
        this.emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

        this.route.post(`/submit`, async (req, res, next) => {
            if (!req.body.email) reject400(req, res, "missing body parameter: email");
            if (!req.body.name) reject400(req, res, "missing body parameter: name");
            if (!req.body.start_date) reject400(req, res, "missing body parameter: start_date");
            if (!req.body.end_date) reject400(req, res, "missing body parameter: end_date");
            if (!req.body.term) reject400(req, res, "missing body parameter: term");
            if (!req.body.email) reject400(req, res, "missing body parameter: email");

            try {
                // store pending request in DB
                const hash = this.dbi.add(req.body.email, req.body.start_date, req.body.end_date, req.body.term, req.body.name, req.body.institution);

                // email manager
                const acceptUrl = new URL(constants.loc.html.ACCEPT_URL);
                acceptUrl.searchParams.append("hash", hash);
                const rejectURL = new URL(constants.loc.html.REJECT_URL);
                rejectURL.searchParams.append("hash",hash);

                const mData = {
                    ACCEPTED_URL : acceptUrl,
                    REJECTED_URL : rejectURL,
                    ...req.body
                }

                const subjectMgr = `Vacation Request From ${req.body.name} (2b)`;
                await this.emi.sendFile(this.dbi.lookupRole("manager").email, "server-assets/request_manager.html", subjectMgr, mData);

                // email staff
                const sData = {
                    date : new Date().toString(),
                    ...req.body
                }                
                if (sData.term == "full") sData.term = "full day";
                const subectStaff = "Vacation Request Verfication Notice (2a)";
                await this.emi.sendFile(req.body.email, "server-assets/confirm_staff.html", subectStaff, sData);

                // this.addAppointment(
                //     req.body.name,
                //     req.body.start_date,
                //     req.body.end_date,
                //     req.body.term
                // );

                res.redirect("/submit");
                res.end();
            } catch (error) {
                logger.error(error.toString());
                console.log(error);
                reject500(req, res, error.toString());
            }
        });
    }

    async addAppointment(name, start, end, term) {
        const summary = `${name} on vacation`;

        if (term === "full") {
            await this.googleCalendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
        } else if (term === "am") {
            start = start + "T09:00:00-04:00";
            end = end + "T13:00:00-04:00";
            await this.googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
        } else if (term === "pm") {
            start = start + "T12:00:00-04:00";
            end = end + "T17:00:00-04:00";
            await this.googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
        }
    }

    async load() {
        await this.googleCalendar.insert(process.env.CALENDAR_ID);
        return this;
    }
}

export default SubmitHandler;
