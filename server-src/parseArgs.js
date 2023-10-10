import ParseArgs from "@thaerious/parseargs";

const options = {
    name: "SN-Vacation",
    short: "SHARCNET Vacation Web App",
    desc: "Online stand-alone web appliction to co-ordinate vacation requests",
    synopsis: "sudo node . [OPTIONS]",
    flags: [
        {
            long: 'verbose',
            type: 'count',
            short: 'v',
            desc: 'Display additional information in the terminal.'
        },
        {
            long: 'port',
            type: 'number',
            short: 'p',
            default: 8080,
            desc: 'Port number to start listening on (default 8080).',
            env: 'PORT'
        },
        {
            long: 'help',
            type: 'boolean',
            desc: 'Display help information.'
        }
    ]
};

const args = new ParseArgs(options);
export { args as default, options };