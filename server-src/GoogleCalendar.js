// see: https://frar.ca/wordpress/?p=318

import { google } from "googleapis";

class GoogleCalendar {
    static SCOPES = ["https://www.googleapis.com/auth/calendar"];

    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFilename: process.env.KEY_FILENAME,
            scopes: GoogleCalendar.SCOPES,
        });

        this.calendar = google.calendar({
            version: "v3",
            auth: auth,
        });
    }

    /**
     * List available calendars.
     */
    list() {
        return new Promise((resolve, reject) => {
            this.calendar.calendarList.list((err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });
    }

    /**
     * Retrieve a calendar.  By default retrievs the primary calendar.
     */
    get(id = "primary") {
        return new Promise((resolve, reject) => {
            const options = {
                calendarId: id,
            };

            this.calendar.calendarList.get(options, (err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });
    }

    /**
     * Add a calendar to this service account.
     */
    insert(id) {
        return new Promise((resolve, reject) => {
            const options = {
                resource: {
                    id: id,
                },
            };

            this.calendar.calendarList.insert(options, (err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });
    }

    /**
     * Remove a calendar from this service account.
     */
    remove(id) {
        return new Promise((resolve, reject) => {
            const options = {
                calendarId: id,
            };

            this.calendar.calendarList.delete(options, (err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });
    }

    // https://developers.google.com/calendar/api/guides/create-events
    addEvent(id, start, end, summary){
        return new Promise((resolve, reject) => {
            const options = {
                calendarId: id,
                resource: {
                    start: {
                        date: start,
                    },
                    end: {
                        date: end,
                    },
                    summary: summary,
                },                
            };

            this.calendar.events.insert(options, (err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });        
    }
}

export default GoogleCalendar;