import Express from "express";
import bodyParser from "body-parser";
import GoogleCalendar from "./GoogleCalendar.js";
import constants from "./constants.js";
import { loadTemplate } from "@thaerious/utility";
import DBInterface from "./DBInterface.js";
import EMInterface from "./EMInterface.js";
import logger from "./setupLogger.js";
import FS from "fs";

class SubmitHandler {
    constructor() {
        this.googleCalendar = new GoogleCalendar();
        this.route = Express.Router();
        this.route.use(bodyParser.urlencoded({ extended: true }));
        this.dbi = new DBInterface().open();
        this.emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

        this.route.post(`/submit`, async (req, res, next) => {
            if (!req.body.email) this.reject400(req, res, "missing body parameter: email");
            if (!req.body.name) this.reject400(req, res, "missing body parameter: name");
            if (!req.body.start_date) this.reject400(req, res, "missing body parameter: start_date");
            if (!req.body.end_date) this.reject400(req, res, "missing body parameter: end_date");
            if (!req.body.term) this.reject400(req, res, "missing body parameter: term");
            if (!req.body.email) this.reject400(req, res, "missing body parameter: email");

            try {
                // store pending request in DB
                const hash = this.dbi.add(req.body.email, req.body.start_date, req.body.end_date, req.body.term, req.body.name, req.body.institution);

                // email manager
                const acceptUrl = new URL(process.env.SERVER_NAME + "/accept");
                acceptUrl.searchParams.append("hash", hash);
                const rejectURL = new URL(process.env.SERVER_NAME + "/reject");
                rejectURL.searchParams.append("hash",hash);

                const mData = {
                    accept_url : acceptUrl,
                    reject_url : rejectURL,
                    ...req.body
                }
                await this.emi.sendFile(this.dbi.lookupRole("manager").email, "server-assets/request_manager.html", mData);

                // email staff
                const sData = {
                    date : new Date().toString(),
                    ...req.body
                }                
                if (sData.term == "full") sData.term = "full day";
                await this.emi.sendFile(req.body.email, "server-assets/confirm_staff.html", sData);

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
                this.reject500(req, res, error.toString());
            }
        });
    }

    reject400(req, res, message) {
        const html = loadTemplate(constants.loc.html.BAD_REQUEST_400, {
            message: message,
            body: JSON.stringify(req.body, null, 2),
        });
        res.send(html);
        res.end();
    }

    reject500(req, res, message) {
        const html = FS.readFileSync(constants.loc.html.SERVER_ERROR_500, "utf-8");
        res.send(html);
        res.end();
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
