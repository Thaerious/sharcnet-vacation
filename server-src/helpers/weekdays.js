
/**
 * Count all weekdays between the two dates inclusive.
 * @param {*} startDate 
 * @param {*} endDate 
 * @returns 
 */
function countWeekdays(startDate, endDate){
    console.log("before");
    console.log(startDate + ", " + startDate.getTimezoneOffset());
    console.log(endDate + ", " + endDate.getTimezoneOffset());
    let sum = 0;
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        console.log(d.getTimezoneOffset());
        if (d.getDay() != 0 && d.getDay() != 6) sum++;
    }
    console.log("after");
    console.log(startDate + ", " + startDate.getTimezoneOffset());
    console.log(endDate + ", " + endDate.getTimezoneOffset());
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
