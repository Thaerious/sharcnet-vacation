import logger from "../server-src/setupLogger.js";

const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
const source = "2023-10-13T17:34:47.933Z";
const result = new Date(source).toLocaleDateString("en-CA", dateOptions)
console.log(source);
console.log(result);