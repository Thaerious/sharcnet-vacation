import { google } from "googleapis";

/**
 * Handler class for Google Calendar API.
 */
class GoogleCalendar {
    static SCOPES = [`https://www.googleapis.com/auth/calendar`];

    /**
     * Constructor makes initial authentication request.
     * @return {undefined}
     */
    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFilename: process.env.GKEY_FILENAME,
            scopes: GoogleCalendar.SCOPES,
        });

        this.calendar = google.calendar({
            version: `v3`,
            auth: auth,
        });
    }

    /**
     * List available calendars.
     * @return {undefined}
     */
    async list() {
        const res = await this.calendar.calendarList.list();
        return res.data;
    }

    /**
     * Retrieve a calendar.  By default retrievs the primary calendar.
     */
    async get(id = `primary`) {
        const res = await this.calendar.calendarList.get({ calendarId: id })
        return res.data
    }

    /**
     * Add a calendar to this service account.
     */
    async insert(id) {
        const res = await this.calendar.calendarList.insert({ requestBody: { id } });
        return res.data;
    }

    /**
     * Remove a calendar from this service account.
     */
    async remove(id) {
        const res = await this.calendar.calendarList.delete({ calendarId: id })
        return res.data
    }

    // https://developers.google.com/calendar/api/guides/create-events
    async addEvent(id, start, end, summary, timed = false) {
        const dateKey = timed ? "dateTime" : "date";
        const res = await this.calendar.events.insert({
            calendarId: id,
            requestBody: {
                start: { [dateKey]: start },
                end: { [dateKey]: end },
                summary,
            },
        });
        return res.data;
    }
}

export default GoogleCalendar;
