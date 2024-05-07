/**
 * Helper functions to keep data formatted and filled.
 */

import CONST from "../constants.js";
import moment from "moment";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

function internationalizeDates(record) {
    return {
        ...record,
        start_date: record.start_date + "T00:00:00",
        end_date: record.end_date + "T00:00:00"
    }
}

/**
 * Create a new object with expanded date information.
 * Takes an input object with the fields "start_date" and "end_date" and produces a new
 * object with "weekday_count", "return_date", and "todays_date" in addition to all the fields from
 * the input object.
 * @param {*} record Source record object, must contain fields: "start_date" and "end_date".
 * @returns New record object with additional fields: "weekday_count", "return_date", "todays_date".
 */
function expandDatesInRecord(record) {
    const endDate = moment(record.end_date);
    const startDate = moment(record.start_date);

    // Ensure endDate is not before startDate
    if (endDate.isBefore(startDate)) {
        endDate = startDate.clone();
    }

    // Calculate the return date based on the duration
    const returnDate = record.duration === "full" ? nextWeekday(endDate) : endDate;

    return {
        ...record,
        weekday_count: record.duration === "full" ? countWeekdays(startDate, endDate) : 0.5,
        return_date: returnDate.toISOString(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        todays_date: moment().toISOString(),
    }
}

/**
* This returns a new object and does not modify the source object.
* Reformats dates to human readable 'Canadian' style.
*/
function humanizeDates(data) {
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

    data = {
        ...data,
        return_date: new Date(data.return_date).toLocaleDateString("en-CA", dateOptions),
        start_date: new Date(data.start_date).toLocaleDateString("en-CA", dateOptions),
        end_date: new Date(data.end_date).toLocaleDateString("en-CA", dateOptions),
        todays_date: new Date(data.todays_date).toLocaleDateString("en-CA", dateOptions),
    }

    return data;
}

/**
 * Populate record object with accept and reject URLs.
 * This function constructs URLs by appending a given hash value as a query parameter
 * to predefined paths for accept and reject actions. These URLs are typically used
 * for operations such as email confirmations or user decision confirmations.
 *
 * @param {*} data The source record object that might contain additional information.
 * @param {*} hash The hash value to insert into the URL as a query parameter.
 *                 This hash is typically used to secure or validate the request.
 * @returns {Object} Returns a new record object augmented with:
 *                   - `accepted_url`: The full URL where a user can confirm or accept an action.
 *                   - `rejected_url`: The full URL where a user can decline or reject an action.
 */
function addURLsToData(data, hash) {
    const acceptURL = new URL(process.env.SERVER_NAME + CONST.LOC.HTML.ACCEPT_PATH);
    acceptURL.searchParams.append("hash", hash);

    const rejectURL = new URL(process.env.SERVER_NAME + CONST.LOC.HTML.REJECT_PATH);
    rejectURL.searchParams.append("hash", hash);

    return {
        ...data,
        accepted_url: acceptURL.href,
        rejected_url: rejectURL.href,
    }
}

/**
 * Augments a record object with a list of managers.
 * This function takes an existing record object and appends a list or array of managers to it.
 * The managers could be in any format (array, object, etc.), depending on the structure expected
 * in the consuming context (e.g., UI component, database entry).
 *
 * @param {Object} record - The source record object that might already contain various fields.
 *                        This object will be returned with added managers field.
 * @param {Array|Object} managers - A list or collection of managers to add to the record object.
 *                                  The structure of this parameter should align with the application's
 *                                  data handling requirements.
 * @returns {Object} Returns a new record object that includes the original data along with a new field `managers`,
 *                   which contains the list or collection of managers provided.
 */
function addManagersToData(record, managers) {
    return {
        ...record,
        managers: managers
    }
}

export { internationalizeDates, expandDatesInRecord as expandDatesInRecord, addURLsToData, addManagersToData, humanizeDates };