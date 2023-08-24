import { mkdirif } from "@thaerious/utility";
import FS from "fs";
import args from "./parseArgs.js";
import Logger, { position } from "@thaerious/logger";
const logger = new Logger();

logger.log.enabled = true;
logger.error.enabled = true;
logger.log.enabled = true;
logger.verbose.enabled = args?.verbose;

logger.log.handlers = [
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

logger.very.handlers = [
    position,
    console
]

logger.debug.handlers = [
    timestamp,
    position,
    console
]

let last = new Date().getTime();
function timestamp(v) {
    const current = new Date().getTime();
    const diff = (current - last) / 1000;
    last = current;
    return `[${diff}s] ${v}`;
}

logger.verbose.enabled = args.verbose >= 1;
logger.very.enabled = args.verbose >= 2;
logger.debug.enabled = args.verbose >= 3;

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