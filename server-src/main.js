import Server from "./Server.js";
import dotenv from "dotenv";
import args, { options } from "./parseArgs.js";
import helpString from "@thaerious/parseargs/src/helpString.js";
import logger from "./setupLogger.js";

dotenv.config();

logger.debug("here");

if (args.help) {
    console.log(helpString(options));
    process.exit();
}

try {
    const server = new Server();
    server.start();
} catch (err) {
    console.error(err);
}