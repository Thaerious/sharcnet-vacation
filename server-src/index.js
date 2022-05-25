import SubmitHandler from "./SubmitHandler.js";
import dotenv from "dotenv";
dotenv.config();

const sh = new SubmitHandler();
await sh.load();
console.log(await sh.googleCalendar.list());