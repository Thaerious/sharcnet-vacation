import ParseArgs from "@thaerious/parseargs";
import { addToCalendar } from "../../server-src/functionality/acceptRequest.js";
import helpString from "@thaerious/parseargs/src/helpString.js";

const options = {
    name: "SN-Vacation",
    short: "Vacation portal addToCalendar manual integration test",
    desc: "",
    synopsis: "node . [OPTIONS]",
    flags: [
        {
            long: 'start_date',
            type: 'string',
            short: 's',
            desc: 'Beginning date.',
            default: '2023-09-01'
        },
        {
            long: 'end_date',
            type: 'string',
            short: 'e',
            desc: 'Ending date',
            default: '2023-09-02'
        },
        {
            long: 'name',
            type: 'string',
            short: 'n',
            desc: 'Name to use in update.',
            default: "Steve McQueen"
        },
        {
            long: 'duration',
            type: 'string',
            short: 'd',
            desc: 'Duration {full, am, pm}.',
            default: "full"
        }           
    ]
};

const args = new ParseArgs(options);

if (args.help) {
    console.log(helpString(options));
    process.exit();
}

(async () => {
    try {
        console.log(args);
        console.log(`env.GKEY_FILENAME ${process.env.GKEY_FILENAME}`);
        console.log(`env.CALENDAR_ID ${process.env.CALENDAR_ID}`);
        
        const res = await addToCalendar(args);
        console.log(res);
    } catch (error) {
        console.log(error);
    }
})();