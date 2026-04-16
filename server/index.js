import Server from "./Server.js";
import dotenv from "dotenv";
import { program } from "commander";
import logger from "./setupLogger.js";

dotenv.config({ quiet: true });

program
    .name("server")
    .description("Application server")
    .option("-v, --verbose", "enable verbose logging")
    .option("-p, --port <number>", "port to listen on", process.env.PORT ?? "3000")
    .helpOption("-h, --help", "display help")
    .parse(process.argv);

const opts = program.opts();
if (opts.verbose) logger.level = 'debug';

if (!process.env.PORT) process.env.PORT = opts.port;

try {
    logger.debug(`Starting server on port ${process.env.PORT}`);
    const server = new Server();
    server.start();
} catch (err) {
    logger.error(err);
}