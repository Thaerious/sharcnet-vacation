import { google } from "googleapis";

/**
 * Handler class for Google Calendar API.
 */
class GoogleUserInfo {
    static SCOPES = [`https://www.googleapis.com/auth/userinfo.email`];

    constructor() {
        const auth = new google.auth.GoogleAuth({
            keyFilename: process.env.GKEY_FILENAME,
            scopes: GoogleCalendar.SCOPES,
        });

        this.userinfo = google.userinfo({
            auth: auth,
        });
    }    

    email() {
        return new Promise((resolve, reject) => {
            this.userinfo.email.
            this.calendar.calendarList.list((err, res) => {
                if (err) reject(err);
                if (res) resolve(res.data);
            });
        });
    }    
}

export default GoogleCalendar;