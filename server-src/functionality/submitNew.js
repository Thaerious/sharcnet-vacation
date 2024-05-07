import CONST from "../constants.js";
import { internationalizeDates, expandDatesInRecord, addManagersToData, addURLsToData, humanizeDates } from "../helpers/buildData.js";
import { loadTemplate } from "@thaerious/utility";
import logger from "../../server-src/setupLogger.js";

/**
 * Generate emails and update the database when a new vacation request is submitted.
 * @param {*} record
 * @param {*} dbi
 * @param {*} emi
 * @returns
 */
async function submitNew(record, dbi, emi) {
    record.status = CONST.STATUS.PENDING;
    record = internationalizeDates(record)
    record = expandDatesInRecord(record);
    const row = dbi.addRequest(record);
    record.row_id = row.id;
    const managers = emailManagers(addURLsToData(record, row.hash), dbi, emi);
    record = addManagersToData(record, managers);
    await emailStaff(record, emi);
    return record;
}

function emailManagers(record, dbi, emi) {
    record = humanizeDates(record);

    const subject = `SHARCNET Vacation Request: ${record.name}, ${record.start_date}`;
    const managerEmails = dbi.getAllRoles(CONST.ROLES.MANAGER).map(row => row.email);
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_MANAGER.HTML, record);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_MANAGER.TXT, record);

    for (const email of managerEmails) {
        emi.send(email, "", subject, html, text, record.row_id);
    }

    return managerEmails;
}

async function emailStaff(record, emi) {
    record = humanizeDates(record);

    const subject = "Vacation Request Confirmation";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.HTML, record);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.NOTIFY_STAFF.TXT, record);
    emi.send(record.email, "", subject, html, text, record.row_id);
}

export default submitNew;