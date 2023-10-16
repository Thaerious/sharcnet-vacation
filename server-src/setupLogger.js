import { mkdirif } from "@thaerious/utility";
import FS from "fs";
import args from "./parseArgs.js";
import Logger, { position } from "@thaerious/logger";
import CONST from "./constants.js";
import chalk from "chalk";

const logger = new Logger();

logger.log.enabled = true;
logger.error.enabled = true;
logger.log.enabled = true;
logger.verbose.enabled = args?.verbose;

logger.console.handlers = [
    objectPrinter,
    position,
    console
]

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

mkdirif(CONST.LOC.LOGFILE);
logger.log.handlers = [
    position,
    (text) => {
        FS.appendFileSync(CONST.LOC.LOGFILE, text + `\n`);
        return text;
    },
    console
]

/**
 * Pretty print an object.
 * Accpets val = current string, org = origional string.
 */
function objectPrinter(val, org) {
    let builder = ``;
    builder += `${objectPrinterHelper(null, org, 0)}`;
    return builder;
}

const indent = '   ';
function objectPrinterHelper(key, object, depth) {
    if (typeof object !== "object") return object;

    let string = "";
    string += indent.repeat(depth);

    if (Array.isArray(object)) {
        if (key != null) string += `${key}: [\n`;
        else string += `[\n`;
    } else {
        if (key != null) string += `${key}: {\n`;
        else string += `{\n`;
    }

    for (const key of Object.keys(object)) {
        const value = object[key];

        if (value === undefined) {
            string += indent.repeat(depth + 1);
            string += `${key}: `;
            string += `${chalk.gray(`undefined`)},\n`;
            continue;
        }

        if (value === null) {
            string += indent.repeat(depth + 1);
            string += `${key}: `;
            string += `${chalk.whiteBright(`null`)},\n`;
            continue;
        }

        switch (typeof value) {
            case `string`:
                string += indent.repeat(depth + 1);
                string += `${key}: `;
                string += chalk.green(`'${value}',\n`);
                break;
            case `number`:
                string += indent.repeat(depth + 1);
                string += `${key}: `;
                string += chalk.blueBright(`${value},\n`);
                break;
            case `object`:
                string += `${objectPrinterHelper(key, value, depth + 1)}`;
                break;
        }
    }

    string += indent.repeat(depth);

    if (Array.isArray(object)) {
        string += `]\n`;
    } else {
        string += `}\n`;
    }

    if (string.length < 0) {
        string = string.replaceAll(`\n`, ` `);
        string = string.replaceAll(/[ ][ ]*/g, ` `);
        return indent.repeat(depth) + string;
    } else {
        return string;
    }
    return string;
}

export default logger;