import GoogleCalendar from "../../server-src/GoogleCalendar.js";
import readline from "readline";
import dotenv from "dotenv";
dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const it = rl[Symbol.asyncIterator]();

const calendar = new GoogleCalendar();
let running = true;

let start, end;

while (running) {
    const line = (await it.next()).value;
    const split = line.split(/[ \t]+/g);

    switch (split[0]) {
        case "exit":
            console.log("Exiting Test");
            running = false;
            rl.close();
            break;
        case "list":
            start = currentTime();
            await list();
            console.log(currentTime() - start + " ms");
            break;
        case "get":
            start = currentTime();
            await get(split);
            console.log(currentTime() - start + " ms");
            break;
        case "id":
            console.log(process.env.CALENDAR_ID);
            break;
        case "add":
            start = currentTime();
            await addEvent(split);
            console.log(currentTime() - start + " ms");
            break;
        case "timed":
            start = currentTime();
            await addTimed(split);
            console.log(currentTime() - start + " ms");
            break;
        default:
            console.log(`unknown command ${split[0]}`);
            break;
    }
}

async function list() {
    console.log(await calendar.list());
}

async function addEvent(split) {
    const start = split[1];
    const end = split[2];
    const summary = split[3];
    await calendar.addEvent(process.env.CALENDAR_ID, start, end, summary);
}

async function addTimed(split) {
    const start = split[1];
    const end = split[2];
    const summary = split[3];
    await calendar.addTimedEvent(process.env.CALENDAR_ID, start, end, summary);
}

async function get() {
    const get = await calendar.get(process.env.CALENDAR_ID);
    return get;
}

function currentTime() {
    var hrTime = process.hrtime();
    return Math.trunc(hrTime[0] * 1000 + hrTime[1] / 1000000);
}
