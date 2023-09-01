
import { format, formatDistance, formatRelative, subDays } from 'date-fns'

const date1 = new Date(2022, 6, 11);
const date2 = new Date("2022-07-11T00:00:00");
const date3 = stringToDate("2022-07-11");

const f1 = format(date1, "yyyy MMM d");
const f2 = format(date2, "yyyy MMM d");
const f3 = format(date3, "yyyy MMM d");

console.log(date1);
console.log(date2);
console.log(date3);
console.log(f1);
console.log(f2);
console.log(f3);

function stringToDate(string){
    if (string.indexOf("T") != -1){
        string = string.split("T")[0];
    }

    const split = string.split("-");
    const y = parseInt(split[0]);
    const m = parseInt(split[1]) - 1;
    const d = parseInt(split[2]);
console.log(y, m, d);
    return new Date(y, m, d);
}