/**
 * Helper functions to keep data formatted and filled.
 */

import CONST from "../constants.js";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

function internationalizeDates(data) {
    return {
        ...data,
        start_date: data.start_date + "T00:00:00",
        end_date: data.end_date + "T00:00:00"
    }
}

/**
 * Create new object with expanded date information.
 * Takes an input object with with the two fields "start_date" and "end_date" and produces a new
 * object with "weekday_count", "return_date", and "todays_date" in addition to all the fields from
 * the input object.
 * @param {*} data Source data object, must contain fields: "start_date" and "end_date".
 * @returns New data object with the additional fields: "weekday_count", "return_date", and "todays_date".
 */
function expandDatesInData(data) {
    const returnDate = data.duration === "full" ? nextWeekday(data.end_date) : data.end_date;

    const startDate = new Date(data.start_date);
    let endDate = new Date(data.end_date);
    if (endDate < startDate) endDate = startDate;

    return {
        ...data,
        weekday_count: data.duration === "full" ? countWeekdays(data.start_date, data.end_date) : 0.5,
        return_date: returnDate.toISOString(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        todays_date: new Date().toISOString(),
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
 * Populate data object with accept and reject URLs.
 * @param {*} data The source data.
 * @param {*} hash The hash value to instert into the url.
 * @returns New data object with the additional fields: "accepted_url" and "rejected_url".
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
 *
 * @param {*} data
 * @param {*} managers
 * @returns
 */
function addManagersToData(data, managers) {
    return {
        ...data,
        managers: managers
    }
}

export { internationalizeDates, expandDatesInData, addURLsToData, addManagersToData, humanizeDates };