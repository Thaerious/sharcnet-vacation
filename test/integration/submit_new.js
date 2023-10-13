import ParseArgs from "@thaerious/parseargs";
import helpString from "@thaerious/parseargs/src/helpString.js";
import FS from "fs";
import Server from "../../server-src/Server.js";
import assert from "assert";
import { options as argOptions } from "../../server-src/parseArgs.js";
import logger from "../../server-src/setupLogger.js";
import DBInterface from "../../server-src/DBInterface.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // turn off ssl check
process.env["DB_DIR"] = "test/db";
process.env["DB_NAME"] = "test.db";

argOptions.flags.push({
    "long": "out",
    "short": "o",
    "default": "test/scratch/submit_response.json",
    "type": "string",
    "desc": "output file path (.json)"
});

argOptions.flags.push({
    "long": "in",
    "short": "i",
    "default": "test/scratch/form_data.json",
    "type": "string",
    "desc": "input file path (.json, from generate_data)"
});

const args = new ParseArgs(argOptions);
if (args.help) {
    logger.console(helpString(argOptions));
    process.exit();
}

const dbi = new DBInterface().open();

// Start Server
var server = null;
try {
    server = new Server();
    await server.start();
} catch (err) {
    console.error(err);
    process.exit();
}

// Check for input files
if (FS.existsSync(args.in)) {
    const file = FS.readFileSync(args.in);
    await fetchSubmit(JSON.parse(file));
    server.stop();
} else {
    console.log(`Input file not found: ${args.in}`);
    console.log(`Run 'generate_form_data'`);
    process.exit();
}

async function fetchSubmit(data) {
    const options = {
        method: 'POST',
        body: encodeForm(data),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    }

    const res = await fetch(`http://127.0.0.1:${args.port}/submit`, options);
    assert.strictEqual(200, res.status);
    const response = await res.json();

    const json = {
        response: response,
        row: await dbi.getRequestById(response.row_id)
    }

    assert.ok(json.row);

    console.log(`Writing results to ${args.out}`);
    FS.writeFileSync(args.out, JSON.stringify(json, null, 2));
    logger.verbose(JSON.stringify(json, null, 2));
    dbi.close();
}

function encodeForm(data) {
    const body = [];
    for (var key of Object.keys(data)) {
        body.push(`${key}=${data[key]}`);
    }
    return body.join("&");
}