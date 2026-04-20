import CONST from "./constants.js";
import { internationalizeDates, expandDatesInRecord, addManagersToData, addURLsToData, humanizeDates } from "./buildData.js";
import loadAsset from "./loadAsset.js";
import { sendEmail } from "./email_interface.js";
import dbi from "./DBInterface.js"

/**
 * Generate emails and update the database when a new vacation request is submitted.
 * Marks the record as pending, expands date fields, stores it in the DB,
 * notifies managers, and sends a confirmation to the staff member.
 * @param {object} record - The raw form submission body.
 * @returns {object} The fully populated record after all processing.
 */
async function submitNew(record) {
    record.status = CONST.STATUS.PENDING;

    // Normalize dates to a consistent internal format
    record = internationalizeDates(record);

    // Expand date fields (e.g. calculate weekday count, return date)
    record = expandDatesInRecord(record);

    // Persist the record and get the generated row (includes id and hash)
    const row = dbi.addRequest(record);
    record.row_id = row.id;

    // Email managers and attach their addresses to the record
    const managers = emailManagers(addURLsToData(record, row.hash));
    record = addManagersToData(record, managers);

    // Send confirmation to the staff member
    await emailStaff(record);

    return record;
}

/**
 * Send a vacation request notification to all managers.
 * Loads the manager email template, resolves all manager addresses from the DB,
 * and sends one email per manager.
 * @param {object} record - The populated record including approval URLs.
 * @returns {string[]} List of manager email addresses that were notified.
 */
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

/**
 * Send a vacation request confirmation to the staff member.
 * Loads the staff email template and sends to the email address on the record.
 * @param {object} record - The fully populated record including manager list.
 */
async function emailStaff(record) {
    record = humanizeDates(record);

    const subject = "Vacation Request Confirmation";
    const html = loadAsset(CONST.ASSETS.NOTIFY_STAFF.HTML, record);
    const text = loadAsset(CONST.ASSETS.NOTIFY_STAFF.TXT, record);
    await sendEmail(record.email, "", subject, html, text, record.row_id);
}

export default submitNew;