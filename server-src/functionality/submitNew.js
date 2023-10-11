import CONST from "../constants.js";
import { expandDatesInData, addManagersToData, addURLsToData } from "../helpers/buildData.js";
import { loadTemplate } from "@thaerious/utility";

/**
 * Generate emails and update the database when a new vacation request is submitted.
 * @param {*} data
 * @param {*} dbi
 * @param {*} emi
 * @returns
 */
async function submitNew(data, dbi, emi) {
    data.status = CONST.STATUS.PENDING;
    const row = dbi.addRequest(data);
    data.row_id = row.id;
    data = expandDatesInData(data);
    const managers = emailManagers(addURLsToData(data, row.hash), dbi, emi);
    data = addManagersToData(data, managers);
    await emailStaff(data, emi);
    return data;
}

function emailManagers(data, dbi, emi) {
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
    const subject = "Vacation Request Confirmation";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.TXT, data);

    emi.send(data.email, "", subject, html, text, data.row_id);
}

export default submitNew;