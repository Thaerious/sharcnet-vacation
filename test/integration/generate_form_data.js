import ParseArgs from "@thaerious/parseargs";
import helpString from "@thaerious/parseargs/src/helpString.js";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import FS from "fs";
import { fsjson, mkdirif } from "@thaerious/utility";
import logger from "../../server-src/setupLogger.js";

const rl = readline.createInterface({ input, output });
const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;

const argOptions = {
    name: "generate_form_data.js",
    short: "SHARCNET Generate Form Data",
    desc: "Create mock data for further integration testing",
    synopsis:`
        node test/integration/generate_form_data.js [OPTIONS]
        fields:
        * start_date  : yyyy-mm-dd
        * end_date    : yyyy-mm-dd
        * name        : [string]
        * institution : [string]
        * email       : [string]
        * duration    : {full, am, pm}`,
    "flags": [
        {
            "long": "out",
            "short": "o",
            "default": "test/scratch/form_data.json",
            "type": "string",
            "desc": "output file path (.json)"
        },
        {
            "long": "in",
            "short": "i",
            "default": "test/scratch/form_data.json",
            "type": "string",
            "desc": "input file path (.json, previous generated data)"
        }
    ]
};

const args = new ParseArgs(argOptions);
if (args.help) {
    logger.console(helpString(argOptions));
    process.exit();
}

mkdirif(args.in);
mkdirif(args.out);

var data = {
    start_date: today,
    end_date: today,
    name: "Freddie Mercury",
    institution: "western",
    email: "frar.test@gmail.com",
    duration: "full",
};

if (FS.existsSync(args.in)) {
    data = fsjson.load(args.in);
}

await (async () => {
    for (var field of Object.keys(data)) {
        var answer = await rl.question(`Enter a value for ${field} (${data[field]}) > `);
        if (answer.trim().length > 0) data[field] = answer;
    }

    rl.close();
    FS.writeFileSync(args.out, JSON.stringify(data, null, 2));
    console.log(`Data written to ${args.out}`);
})()