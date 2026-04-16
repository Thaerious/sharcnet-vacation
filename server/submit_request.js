import CONST from "./constants.js";
import { internationalizeDates, expandDatesInRecord, addManagersToData, addURLsToData, humanizeDates } from "./buildData.js";
import loadAsset from "./loadAsset.js";
import { sendEmail } from "./email_interface.js";
import dbi from "./DBInterface.js"

/**
 * Generate emails and update the database when a new vacation request is submitted.
 * @param {*} record
 * @param {*} dbi
 * @param {*} emi
 * @returns
 */
async function submitNew(record) {
    record.status = CONST.STATUS.PENDING;
    record = internationalizeDates(record)
    record = expandDatesInRecord(record);
    const row = dbi.addRequest(record);
    record.row_id = row.id;
    const managers = emailManagers(addURLsToData(record, row.hash), dbi);
    record = addManagersToData(record, managers);
    await emailStaff(record);
    return record;
}

function emailManagers(record) {
    record = humanizeDates(record);

    const subject = `SHARCNET Vacation Request: ${record.name}, ${record.start_date}`;
    const managerEmails = dbi.getAllRoles(CONST.ROLES.MANAGER).map(row => row.email);
    const html = loadAsset(CONST.ASSETS.NOTIFY_MANAGER.HTML, record);
    const text = loadAsset(CONST.ASSETS.NOTIFY_MANAGER.TXT, record);

    for (const email of managerEmails) {
        sendEmail(email, "", subject, html, text, record.row_id);
    }

    return managerEmails;
}

async function emailStaff(record) {
    record = humanizeDates(record);

    const subject = "Vacation Request Confirmation";
    const html = loadAsset(CONST.ASSETS.NOTIFY_STAFF.HTML, record);
    const text = loadAsset(CONST.ASSETS.NOTIFY_STAFF.TXT, record);
    sendEmail(record.email, "", subject, html, text, record.row_id);
}

export default submitNew;