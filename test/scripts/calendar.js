import GoogleCalendar from "../../server-src/GoogleCalendar.js";
import dotenv from "dotenv";

(async () => {
    dotenv.config();
    const gc = new GoogleCalendar();
    await gc.insert(process.env.CALENDAR_ID);

    const date = new Date().toString();
    console.log(new Date().toISOString());

    // const list = await gc.list();
    // console.log(list);

    // console.log(await gc.get(process.env.CALENDAR_ID));

    // await gc.addEvent(process.env.CALENDAR_ID, "2022-05-21", "2022-05-22", "woot");
})();
