import Express from "express";
import http from "http";
import CONST from "./constants.js";
import logger from "./setupLogger.js";
import FS from "fs";
import Path from "path";
import https from "https";
import args from "./parseArgs.js";
import chalk from "chalk";

class Server {
    constructor() {
        this.app = Express();
        this.app.set(`views`, Path.join("www", "static"));
        this.app.set(`view engine`, `ejs`);
    }

    async start() {
        await this.loadRoutes();
        if (args['ssl']) this.startHTTPS();
        else this.startHTTP();
    }

    startHTTP(port = process.env.PORT, ip = `0.0.0.0`) {
        this.server = http.createServer(this.app);
        this.server.listen(port, ip, () => {
            logger.log(chalk.green(`HTTP Listening on port ${port}`));
        });

        process.on(`SIGINT`, () => this.stop(this.server));
        process.on(`SIGTERM`, () => this.stop(this.server));
        return this;
    }

    startHTTPS(port = process.env.PORT, ip = `0.0.0.0`) {
        if (CONST.SERVER.SSL_KEY && CONST.SERVER.SSL_CERT) {
            const key = FS.readFileSync(CONST.SERVER.SSL_KEY);
            const cert = FS.readFileSync(CONST.SERVER.SSL_CERT);
            this.server = https.createServer({ cert, key }, this.app);

            this.server.on('error', error => {
                throw new Error(error);
            });

            this.server.listen(port, ip, () => {
                logger.log(chalk.green(`HTTPS Listening on port ${port}`));
            });

            process.on(`SIGINT`, () => this.stop());
            process.on(`SIGTERM`, () => this.stop());
            return this;
        }

        process.on(`SIGINT`, () => this.stop(this.https));
        process.on(`SIGTERM`, () => this.stop(this.https));
        return this;
    }

    stop() {
        logger.verbose(chalk.green(`Shutting down server.`));
        this.server.close();
        process.exit();
    }

    async loadRoutes(path = CONST.LOC.ROUTES) {
        logger.verbose(`routes path ${path} ${FS.existsSync(path)}`);
        if (!FS.existsSync(path)) return;

        const contents = FS.readdirSync(path).sort();

        for (const entry of contents) {
            const fullpath = Path.join(process.cwd(), path, entry);
            try {
                const { default: route } = await import(fullpath);
                this.app.use(route);
                logger.verbose(chalk.blue(`router ${fullpath}`));
            }
            catch (err) {
                logger.verbose(chalk.red(`router ${fullpath}`));
                logger.log(err);
                this.stop();
            }
        }
    }
}

export default Server;
