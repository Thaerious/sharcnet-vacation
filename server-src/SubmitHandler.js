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

            this.addAppointment(req.body.name, req.body.start_date, req.body.end_date);
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

    async addAppointment(name, start, end) {
        const summary = `${name} on vacation`;
        await this.googleCalendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
    }

    async load() {
        await this.googleCalendar.insert(process.env.CALENDAR_ID);
        return this;
    }
}

export default SubmitHandler;
