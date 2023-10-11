import ParseArgs from "@thaerious/parseargs";
import FS from "fs";
import Server from "../../server-src/Server.js";
import assert from "assert";
import DBInterface from "../../server-src/DBInterface.js";
import { options } from "../../server-src/parseArgs.js";
import { emi } from "../../server-src/routes-enabled/250-submit.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // turn off ssl check
process.env["DB_DIR"] = "test/db";
process.env["DB_NAME"] = "test.db";

options.flags.push({
    "long": "out",
    "short": "o",
    "default": "test/scratch/submit_response.json",
    "type": "string"
});

options.flags.push({
    "long": "in",
    "short": "i",
    "default": "test/scratch/form_data.json",
    "type": "string"
});

const args = new ParseArgs(options);

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
    await emi.wait();
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

    const dbi = new DBInterface().open();

    const res = await fetch(`http://127.0.0.1:${args.port}/submit`, options);
    assert.strictEqual(200, res.status);
    const response = await res.json();

    const json = {
        response: response,
        row: await dbi.getRequestById(response.row_id)
    }

    console.log(`Writing results to ${args.out}`);
    FS.writeFileSync(args.out, JSON.stringify(json, null, 2));
    dbi.close();
}

function encodeForm(data) {
    const body = [];
    for (var key of Object.keys(data)) {
        body.push(`${key}=${data[key]}`);
    }
    return body.join("&");
}