import ParseArgs from "@thaerious/parseargs";
import FS from "fs";
import Server from "../../server-src/Server.js";
import assert from "assert";
import CONST from "../../server-src/constants.js";
import { options } from "../../server-src/parseArgs.js";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // turn off ssl check
process.env["DB_DIR"] = "test/db";
process.env["DB_NAME"] = "test.db";

options.flags.push({
    "long": "out",
    "short": "o",
    "default": "test/scratch/reject_response.html",
    "type": "string"
});

options.flags.push({
    "long": "in",
    "short": "i",
    "default": "test/scratch/submit_response.json",
    "type": "string"
});

const args = new ParseArgs(options);

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

async function fetchSubmit(inputFileData) {
    const options = {
        method: 'POST',
        headers: { },
    }

    const acceptUrl = new URL(CONST.LOC.HTML.REJECT_URL);
    acceptUrl.searchParams.append("hash", inputFileData.row.hash);

    const res = await fetch(acceptUrl, options);
    assert.strictEqual(200, res.status);
    const response = await res.text();

    FS.writeFileSync(args.out, response);
    console.log(response);
}
