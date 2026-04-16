/**
 * Count all weekdays between the two dates inclusive.
 * @param {string | Date} startDate - Start date in a string or Date format
 * @param {string | Date} endDate - End date in a string or Date format
 * @returns {number} - Number of weekdays
 */
function countWeekdays(startDate, endDate) {
    let current = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;

    while (current <= end) {
        const day = current.getUTCDay();
        if (day !== 0 && day !== 6) count++;
        current.setUTCDate(current.getUTCDate() + 1);
    }

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
