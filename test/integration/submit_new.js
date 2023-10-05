import submitNew from "../../server-src/functionality/submitNew.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";
import ParseArgs from "@thaerious/parseargs";
import FS from "fs";
import mkdirif from "@thaerious/utility/src/mkdirif.js";

const args = new ParseArgs({
    flags: [
        {
            long: "out",
            short: "o",
            default: "test/scratch/submit_data.json",
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

mkdirif(args.out);
const dbi = new DBInterface("production.db").open();
const emi = new EMInterface();

var data;
if (FS.existsSync(args.in)) {
    const file = FS.readFileSync(args.in);
    data = JSON.parse(file);
    console.log(`Input data:`);
    console.log(data);
} else {
    console.log(`Input file not found: ${args.in}`);
    console.log(`Run 'generate_form_data'`);
    process.exit();
}

const r1 = await submitNew(data, dbi, emi)
console.log(`\nOutput Data:`);
console.log(r1);
FS.writeFileSync(args.out, JSON.stringify(r1, null, 2));
console.log(`\nData written to ${args.out}`);
console.log("Program will exit when email send completes.");
