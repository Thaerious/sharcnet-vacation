import Express from "express";
import bodyParser from "body-parser";
import GoogleCalendar from "./GoogleCalendar.js";
import constants from "./constants.js";
import {loadTemplate} from "@thaerious/utility";

class SubmitHandler {
    constructor() {
        this.googleCalendar = new GoogleCalendar();
        this.route = Express.Router();
        this.route.use(bodyParser.urlencoded({extended: true}));

        this.route.post(`/submit`, (req, res, next) => {
            console.log(`submit route`);
            console.log(req.body);

            if (!req.body.name) this.reject(req, res, "missing body parameter: name");
            if (!req.body.start_date) this.reject(req, res, "missing body parameter: start_date");
            if (!req.body.end_date) this.reject(req, res, "missing body parameter: end_date");
            if (!req.body.term) this.reject(req, res, "missing body parameter: term");

            this.addAppointment(
                req.body.name, 
                req.body.start_date, 
                req.body.end_date, 
                req.body.term
            );

            res.redirect("/submit");
            res.end();
        });
    }

    reject(req, res, message){        
        const html = loadTemplate(constants.loc.html.BAD_REQUEST_400, {
            message : message,
            body : JSON.stringify(req.body, null, 2)
        });
        res.send(html);
        res.end();
    }

    async addAppointment(name, start, end, term) {
        const summary = `${name} on vacation`;

        if (term === "full"){
            await this.googleCalendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
        } else if (term === "am"){
            start = start + "T09:00:00-04:00";
            end = end + "T13:00:00-04:00";
            await this.googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
        } else if (term === "pm"){
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
