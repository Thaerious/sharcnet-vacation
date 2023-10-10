import Server from "./Server.js";
import dotenv from "dotenv";
import args, { options } from "./parseArgs.js";
import helpString from "@thaerious/parseargs/src/helpString.js";
import logger from "./setupLogger.js";
import CONST from "./constants.js";

dotenv.config();

if (args.help) {
    logger.console(helpString(options));
    process.exit();
}

try {
    if (args.ssl) {
        logger.verbose(`Starting Server on Port ${process.env.PORT} with SSL`);
    }
    else {
        logger.verbose(`Starting Server on Port ${process.env.PORT}`);
    }
    const server = new Server();
    server.start();
} catch (err) {
    console.error(err);
}