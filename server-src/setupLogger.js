import { mkdirif } from "@thaerious/utility";
import FS from "fs";
import args from "./parseArgs.js";
import Logger, { position } from "@thaerious/logger";
const logger = new Logger();

logger.standard.enabled = true;
logger.error.enabled = true;
logger.log.enabled = true;
logger.verbose.enabled = args?.verbose;

logger.standard.handlers = [
    position,
    console
]

logger.error.handlers = [
    position,
    console
]

logger.verbose.handlers = [
    position,
    console
]

mkdirif("logs/log.text");
logger.log.handlers = [
    position,
    (text) => {
        FS.appendFileSync("logs/log.text", text + "\n");
        return text;
    },
    console
]

export default logger;