import { parseArgs } from "node:util";

const options = {
    verbose: {
        type: 'boolean',
        short: 'v',
    },
    port: {
        type: 'string',
        short: 'p'
    }
};

const { _, tokens } = parseArgs({ args: process.args, options: options, tokens: true });
const args = {};
const t = tokens.map(t => {
    const c = args[t.name] ? args[t.name].count + 1 : 1;
    args[t.name] = { ...t, count: c };
});

export default args;