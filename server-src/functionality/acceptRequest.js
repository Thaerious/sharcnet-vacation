import CONST from "../constants.js";
import GoogleCalendar from "../GoogleCalendar.js";
import { loadTemplate } from "@thaerious/utility";
import { expandDatesInData } from "../helpers/buildData.js";

const googleCalendar = new GoogleCalendar();
await googleCalendar.insert(process.env.CALENDAR_ID);

async function acceptRequest(hash, managerEmail, dbi, emi) {
    // Check and/or update status
    let data = dbi.getRequestByHash(hash);
    if (data.status !== CONST.STATUS.PENDING) {
        return {
            success: false,
            message: "Request status: ${data.status}"
        }
    }

    dbi.updateStatusByHash(hash, CONST.STATUS.ACCEPTED);
    data = expandDatesInData(data);
    data["status"] = CONST.STATUS.ACCEPTED;
    data["manager_email"] = managerEmail;
    sendStaffEmail(data, emi);
    sendAdminEmail(data, emi, dbi);
    sendManagerEmail(data, emi, dbi);
    await addToCalendar(data);

    return {
        success: true,
        message: "Vacation request has been accepted."
    }
}

function sendStaffEmail(data, emi) {
    const subject = "SHARCNET Vacation Request Update: Accepted.";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.STAFF_ACCEPTED.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.STAFF_ACCEPTED.TXT, data);
    emi.send(data.email, "", subject, html, text);
}

function sendAdminEmail(data, emi, dbi) {
    const subject = "SHARCNET Staff Vacation Notification";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_ADMIN.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_ADMIN.TXT, data);

    for (const row of dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)) {
        emi.send(row.email, "", subject, html, text);
    }
}

function sendManagerEmail(data, emi, dbi) {
    const subject = `SHARCNET Vacation Accepted for '${data.name}'.`;
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_ADMIN.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_ADMIN.TXT, data);

    for (const row of dbi.getAllRoles(CONST.ROLES.MANAGER)) {
        emi.send(row.email, "", subject, html, text);
    }
}

/**
 * Add accepted request to the calendar.
 * data: the data object recevied from the HTML form.
 *
 * data {
 *     name : string,
 *     start_date: string(yyyy-mm-dd),
 *     end_date: string(yyyy-mm-dd)
 * }
 */
async function addToCalendar(data) {
    const summary = `${data.name} on vacation`;

    if (data.duration === "full") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);

        endDate.setDate(endDate.getDate() + 1);

        const start = startDate.toISOString().split("T")[0];
        const end = endDate.toISOString().split("T")[0];

        return await googleCalendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
    } else if (data.duration === "am") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.start_date);

        startDate.setHours(9);
        endDate.setHours(13);

        const start = startDate.toISOString();
        const end = endDate.toISOString();
        return await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    } else if (data.duration === "pm") {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.start_date);

        startDate.setHours(13);
        endDate.setHours(17);

        const start = startDate.toISOString();
        const end = endDate.toISOString();
        return await googleCalendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
    }
}

export {
    acceptRequest as default,
    sendStaffEmail,
    sendAdminEmail,
    sendManagerEmail,
    addToCalendar
};