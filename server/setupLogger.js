import pino from "pino";

const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const logFile = process.env.LOGFILE ?? 'logs/app.log';

const targets = [
    {
        target: 'pino/file',
        level: 'info',
        options: { destination: logFile, mkdir: true }
    }
];

if (verbose) {
    targets.push({
        target: 'pino-pretty',
        level: 'debug',
        options: { colorize: true }
    });
}

const logger = pino({
    level: verbose ? 'debug' : 'info',
    transport: { targets }
});

export default logger;
