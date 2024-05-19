import moment from 'moment';

/**
 * Count all weekdays between the two dates inclusive.
 * @param {string | Date} startDate - Start date in a string or Date format
 * @param {string | Date} endDate - End date in a string or Date format
 * @returns {number} - Number of weekdays
 */
function countWeekdays(startDate, endDate) {
    console.log(startDate, endDate);
    // Ensure both startDate and endDate are moment objects
    let start = moment(startDate);
    let end = moment(endDate);
    let count = 0;

    console.log(startDate, endDate);
    while (start <= end) {
        // Monday to Friday are days 1-5
        if (start.day() !== 0 && start.day() !== 6) {
            count++;
        }
        start.add(1, 'days');
    }

    console.log(startDate, endDate);
    return count;
}


/**
 * Increment the date to the next weekday.
 * @param {*} date
 * @returns
 */
function nextWeekday(date){
    let weekday = new Date(date);
    weekday.setUTCDate(weekday.getUTCDate() + 1);

    while(weekday.getUTCDay() == 0 || weekday.getUTCDay() == 6){
        weekday.setUTCDate(weekday.getUTCDate() + 1);
    }
    return weekday;
}

export {countWeekdays, nextWeekday};
