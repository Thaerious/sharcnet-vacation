import ParseArgs from "@thaerious/parseargs";
import FS from "fs";
import Server from "../../server-src/Server.js";
import assert from "assert";
import { options } from "../../server-src/parseArgs.js";

options.flags.push({
    "long": "out",
    "short": "o",
    "default": "test/scratch/accept_response.html",
    "type": "string"
});

options.flags.push({
    "long": "in",
    "short": "i",
    "default": "test/scratch/submit_response.json",
    "type": "string"
});

const args = new ParseArgs(options);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"; // turn off ssl check
process.env["DB_DIR"] = "test/db";
process.env["DB_NAME"] = "test.db";
process.env["SERVER_NAME"] = `http://127.0.0.1:${args.port}`;

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

    const acceptURL = `http://127.0.0.1:${args.port}/accept?hash=${inputFileData.row.hash}`;
    console.log(acceptURL);
    // const acceptURL = new URL(process.env.SERVER_NAME + CONST.LOC.HTML.ACCEPT_PATH);
    // acceptURL.searchParams.append("hash", inputFileData.row.hash);

    const res = await fetch(acceptURL, options);
    assert.strictEqual(200, res.status);
    const response = await res.text();

    FS.writeFileSync(args.out, response);
    console.log(response);
}
