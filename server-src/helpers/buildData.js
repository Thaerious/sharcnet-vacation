/**
 * Helper functions to keep data formatted and filled.
 */

import CONST from "../constants.js";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

/**
 * Populate data with expanded date information.
 *
 * This returns a new object and does not modify the source object.  Reformats "start_date"
 * and "end_date" to Canadian style.
 * @param {*} data Source data object, must contain fields: "start_date" and "end_date".
 * @returns New data object with the additional fields: "weekday_count", "return_date", and "todays_date".
 */
function expandDatesInData(data) {
    const startDate = new Date(data.start_date + "T00:00:00");
    const endDate = new Date(data.end_date + "T00:00:00");
    const returnDate = nextWeekday(endDate);
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

    return {
        ...data,
        weekday_count: countWeekdays(startDate, endDate),
        return_date: returnDate.toLocaleDateString("en-CA", dateOptions),
        start_date: startDate.toLocaleDateString("en-CA", dateOptions),
        end_date: endDate.toLocaleDateString("en-CA", dateOptions),
        todays_date: new Date().toLocaleDateString("en-CA", dateOptions),
    }
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
function addManagersToData(data, managers){
    return {
        ...data,
        managers: managers
    }
}

export { expandDatesInData, addURLsToData, addManagersToData};