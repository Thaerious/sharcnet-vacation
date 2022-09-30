import CONST from "../constants.js";
import GoogleCalendar from "../GoogleCalendar.js";
import {statusData} from "../helpers/buildData.js";

const googleCalendar = new GoogleCalendar();
await googleCalendar.insert(process.env.CALENDAR_ID);

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
 async function acceptRequest(hash, managerEmail, dbi, emi){
    // Check and/or update status
    let data = statusData(dbi.get(hash), managerEmail);
    if (data.status !== CONST.STATUS.PENDING){
        return {
            success : false,
            message : "Request status: ${data.status}"
        }
    }

    dbi.update(hash, CONST.STATUS.ACCEPTED);

    // Send Staff Email
    const staffSubject = "SHARCNET Vacation Request Update: Accepted.";
    emi.sendFile(data.email, "", CONST.RESPONSE.STAFF_ACCEPTED, staffSubject, data);    
        
    // Send admin email
    const adminSubject = "SHARCNET Staff Vacation Notification";    
    for (const row of dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)){
        emi.sendFile(row.email, "", CONST.RESPONSE.NOTIFY_ADMIN, adminSubject, data);  
        emi.sendFile("frar.test+guelph@gmail.com", "", CONST.RESPONSE.NOTIFY_ADMIN, adminSubject, data);  
    }

    // Send manager email
    const managerSubject = `SHARCNET Vacation Accepted for '${data.name}'.`;
    for (const row of dbi.getAllRoles(CONST.ROLES.MANAGER)) {
        emi.sendFile(row.email, "", CONST.RESPONSE.NOTIFY_ADMIN, managerSubject, data);          
    }

    await addAppointment(data);

    return {
        success : true,
        message : "Vacation request has been accepted."
    }    
}

async function addAppointment(data) {
    const summary = `${data.name} on vacation`;

    if (data.duration === "full") {
        await googleCalendar.addEvent(process.env.CALENDAR_ID, data.start_date, data.end_date, summary);
    } else if (data.duration === "am") {
        const start = data.start_date + "T09:00:00-00:00";
        const end = data.start_date + "T13:00:00-00:00";
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    } else if (data.duration === "pm") {
        const start = data.start_date + "T12:00:00-00:00";
        const end = data.end_date + "T17:00:00-00:00";
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    }
}

export default acceptRequest;