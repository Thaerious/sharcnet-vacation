import CONST from "../constants.js";
import { internationalizeDates, expandDatesInData, addManagersToData, addURLsToData, humanizeDates } from "../helpers/buildData.js";
import { loadTemplate } from "@thaerious/utility";
import logger from "../../server-src/setupLogger.js";

/**
 * Generate emails and update the database when a new vacation request is submitted.
 * @param {*} data
 * @param {*} dbi
 * @param {*} emi
 * @returns
 */
async function submitNew(data, dbi, emi) {
    data.status = CONST.STATUS.PENDING;
    data = internationalizeDates(data)
    data = expandDatesInData(data);
    const row = dbi.addRequest(data);
    data.row_id = row.id;
    const managers = emailManagers(addURLsToData(data, row.hash), dbi, emi);
    data = addManagersToData(data, managers);
    await emailStaff(data, emi);
    return data;
}

function emailManagers(data, dbi, emi) {
    data = humanizeDates(data);

    const subject = `SHARCNET Vacation Request: ${data.name}, ${data.start_date}`;
    const managerEmails = dbi.getAllRoles(CONST.ROLES.MANAGER).map(row => row.email);
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_MANAGER.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_MANAGER.TXT, data);

    for (const email of managerEmails) {
        emi.send(email, "", subject, html, text, data.row_id);
    }

    return managerEmails;
}

async function emailStaff(data, emi) {
    data = humanizeDates(data);

    const subject = "Vacation Request Confirmation";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.TXT, data);
    emi.send(data.email, "", subject, html, text, data.row_id);
}

export default submitNew;