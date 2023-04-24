import { mkdirif } from "@thaerious/utility";
import FS, { mkdir } from "fs";
import args from "./parseArgs.js";

import Logger from "@thaerious/logger";
const logger = new Logger();

logger.standard.enabled = true;
logger.error.enabled = true;
logger.log.enabled = true;
logger.verbose.enabled = args?.verbose;

logger.verbose("verbose");

mkdirif("log/log.text");
logger.log.handlers = [
    (text) => FS.appendFileSync("log/log.text", text + "\n"),
    console
]

export default logger;