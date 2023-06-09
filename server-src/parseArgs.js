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
            short: 'p',
            default: undefined
        }
    ]
};

const args = new ParseArgs(options);
export default args;