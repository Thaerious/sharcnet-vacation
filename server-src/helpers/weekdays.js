
/**
 * Count all weekdays between the two dates inclusive.
 * @param {*} startDate
 * @param {*} endDate
 * @returns
 */
function countWeekdays(startDate, endDate) {
    if (typeof (startDate) == "string") startDate = new Date(startDate);
    if (typeof (endDate) == "string") endDate = new Date(endDate);

    let sum = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        if (d.getDay() != 0 && d.getDay() != 6) sum++;
    }
    return sum;
}

/**
 * Increment the date,
 * repeat until the date is a weekday.
 * @param {*} date
 * @returns
 */
function nextWeekday(date){
    let weekday = new Date(date);
    weekday.setDate(weekday.getDate() + 1);

    while(weekday.getDay() == 0 || weekday.getDay() == 6){
        weekday.setDate(weekday.getDate() + 1);
    }
    return weekday;
}

export {countWeekdays, nextWeekday};
