import ParseArgs from "@thaerious/parseargs";
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import FS from "fs";
import { mkdirif } from "@thaerious/utility";

const rl = readline.createInterface({ input, output });

const args = new ParseArgs({
    flags: [
        {
            long: "out",
            short: "o",
            default: "test/scratch/form_data.json",
            type: "string"
        },
        {
            long: "in",
            short: "i",
            default: "test/scratch/form_data.json",
            type: "string"
        }
    ]
});

const date = new Date();
const today = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate().toString().padStart(2, '0')}`;

var data = {
    start_date: today,
    end_date: today,
    name: "Freddie Mercury",
    institution: "western",
    email: "frar.test@gmail.com",
    duration: "full",
};

mkdirif(args.in);
mkdirif(args.out);

if (FS.existsSync(args.in)) {
    const file = FS.readFileSync(args.in);
    data = JSON.parse(file);
}

if (args.help) {
    console.log("Generate mock form data.");
    process.exit();
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