import constants from "../constants.js";
import GoogleCalendar from "../GoogleCalendar.js";

const googleCalendar = new GoogleCalendar();

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
 async function acceptRequest(hash, dbi, emi){
    dbi.update(hash, constants.status.ACCEPTED);    

    const data = {
        todays_date : new Date().toString(),
        manager_email : dbi.lookupRole("manager").email,
        status : constants.status.ACCEPTED,
        ...dbi.get(hash)
    }       

    const staffSubject = "Vacation Request Update: Accepted.";
    emi.sendFile(data.email, constants.response.NOTIFY_STAFF, staffSubject, data);    

    const adminSubject = "SHARCNET Vacation Confirmation";
    const adminEmail = dbi.lookupRole(data.institution).email;
    emi.sendFile(adminEmail, constants.response.NOTIFY_ADMIN, adminSubject, data);  

    await addAppointment(data);
}

async function addAppointment(data) {
    const summary = `${data.name} on vacation`;

    if (data.type === "full") {
        await googleCalendar.addEvent(process.env.CALENDAR_ID, data.start_date, data.end_date, summary);
    } else if (data.type === "am") {
        data.start_date = data.start_date + "T09:00:00-04:00";
        data.end_date = data.end_date + "T13:00:00-04:00";
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, data.start_date, data.end_date, summary);
    } else if (data.type === "pm") {
        data.start_date = data.start_date + "T12:00:00-04:00";
        data.end_date = data.end_date + "T17:00:00-04:00";
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, data.start_date, data.end_date, summary);
    }
}

export default acceptRequest;