const data = {
    start_date: 'Wed, Nov 16, 2022',
    end_date: 'Thu, Nov 17, 2022'
}

const startDate = new Date(data.start_date);
const endDate = new Date(data.start_date);

startDate.setHours(13);
// startDate.setUTCHours(-5);
endDate.setHours(17);
// endDate.setUTCHours(-5);

const start = startDate.toISOString();
const end = endDate.toISOString();

console.log(start);
console.log(end);

console.log(startDate.toLocaleString());
console.log(endDate.toLocaleString());
