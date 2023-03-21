import CONST from "../constants.js";
import GoogleCalendar from "../GoogleCalendar.js";
import {statusData} from "../helpers/buildData.js";

const googleCalendar = new GoogleCalendar();
await googleCalendar.insert(process.env.CALENDAR_ID);

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
    data = statusData(dbi.get(hash), managerEmail);

    // Send Staff Email
    const staffSubject = "SHARCNET Vacation Request Update: Accepted.";
    emi.sendFile(data.email, "", CONST.RESPONSE.STAFF_ACCEPTED, staffSubject, data);    
        
    // Send Admin Email
    const adminSubject = "SHARCNET Staff Vacation Notification";    
    for (const row of dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)){
        emi.sendFile(row.email, "", CONST.RESPONSE.NOTIFY_ADMIN, adminSubject, data);  
    }

    // Send Manager Email
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

    if (data.duration === "full day") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        endDate.setDate(endDate.getDate() + 1);

        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];
    
        await googleCalendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
    } else if (data.duration === "am") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.start_date);    

        startDate.setHours(9);    
        endDate.setHours(13);  

        const start = startDate.toISOString();
        const end = endDate.toISOString();
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    } else if (data.duration === "pm") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.start_date);    

        startDate.setHours(13);    
        endDate.setHours(17);  

        const start = startDate.toISOString();
        const end = endDate.toISOString();
        await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    }
}

export default acceptRequest;