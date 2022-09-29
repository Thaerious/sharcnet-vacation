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
function buildData(data) {
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
 * Expand buildData to include manager accept/reject urls
 * @param {*} data 
 */
function managerData(data, email, hash) {    
    const acceptUrl = new URL(CONST.LOC.HTML.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);
    acceptUrl.searchParams.append("email", email);

    const rejectURL = new URL(CONST.LOC.HTML.REJECT_URL);
    rejectURL.searchParams.append("hash", hash);
    acceptUrl.searchParams.append("email", email);

    const mData = {
        ...buildData(data),
        ACCEPTED_URL: acceptUrl,
        REJECTED_URL: rejectURL,
    }
}

function staffPending(data, managers){
    return {
        ...buildData(data),
        manager_email: "<li>" + managers.join("<li>"),
        status: CONST.STATUS.PENDING,
    }
}

function acceptedData(data, managerEmail){
    return {
        ...buildData(data),
        manager_email : managerEmail,
        status : CONST.STATUS.ACCEPTED,
    }         
}

export { buildData, managerData, staffPending, acceptedData};