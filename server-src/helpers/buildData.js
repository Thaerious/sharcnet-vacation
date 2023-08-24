/**
 * Helper functions to keep data formatted and filled.
 */

import CONST from "../constants.js";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

/**
 * Populate data with expanded date information.
 * @param {*} data 
 * @returns 
 */
function expandDatesInData(data) {
    const startDate = new Date(data.start_date + "T00:00:00");
    const endDate = new Date(data.end_date + "T00:00:00");
    const returnDate = nextWeekday(endDate);
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

    if (data.duration == "full") data.duration = "full day";

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
 * Expand expandDatesInData to include manager accept/reject urls
 * @param {*} data 
 */
function addURLsToData(data, hash) {    
    const acceptUrl = new URL(CONST.LOC.HTML.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);

    const rejectURL = new URL(CONST.LOC.HTML.REJECT_URL);
    rejectURL.searchParams.append("hash", hash);

    return {
        ...data, 
        ACCEPTED_URL: acceptUrl.href,
        REJECTED_URL: rejectURL.href, 
    }
}

function addManagersToData(data, managers){
    return {
        ...data, 
        managers: managers        
    }
}

export { expandDatesInData, addURLsToData, addManagersToData};