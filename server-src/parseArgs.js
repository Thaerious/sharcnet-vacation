import ParseArgs from "@thaerious/parseargs";

const options = {
    flags: [
        {
            long: 'verbose',
            type: 'boolean',
            short: 'v',
        },
        {
            long: 'port',
            type: 'string',
            short: 'p'
        }
    ]
};

const args = new ParseArgs(options);
console.log(args.port);
export default args;