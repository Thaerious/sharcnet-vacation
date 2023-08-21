import dotenv from "dotenv";
import Express from "express";
import http from "http";
import CONST from "./constants.js";
import logger from "./setupLogger.js";
import FS from "fs";
import Path from "path";
import https from "https";
import args from "./parseArgs.js";

class Server {
    constructor() {
        this.app = Express();
        this.app.set(`views`, Path.join("www", "static"));
        this.app.set(`view engine`, `ejs`);
        this.loadRoutes();
    }

    start() {
        // if (!args['no-http']) this.startHTTP();
        if (!args['no-ssl']) this.startHTTPS();
    }

    startHTTP(port = CONST.SERVER.PORT, ip = `0.0.0.0`) {
        this.server = http.createServer(this.app);
        this.server.listen(port, ip, () => {
            logger.standard(`Listening on port ${port}`);
        });

        process.on(`SIGINT`, () => this.stop(this.server));
        process.on(`SIGTERM`, () => this.stop(this.server));
        return this;
    }

    startHTTPS(port = 443, ip = `0.0.0.0`) {
        if (CONST.SERVER.SSL_KEY && CONST.SERVER.SSL_CERT) {
            const key = FS.readFileSync(CONST.SERVER.SSL_KEY);
            const cert = FS.readFileSync(CONST.SERVER.SSL_CERT);
            this.https = https.createServer({ cert, key }, this.app);

            this.https.on('error', error => {
                throw (new Error(error));
            });

            this.https.listen(port, ip, () => {
                logger.standard(`<green>HTTPS Listening on port ${port}</green>`);
            });
        }

        process.on(`SIGINT`, () => this.stop(this.https));
        process.on(`SIGTERM`, () => this.stop(this.https));
        return this;
    }

    stop() {
        logger.standard(`Stopping this.server`);
        this.server.close();
        process.exit();
    }

    async loadRoutes(path = CONST.LOC.ROUTES) {
        logger.verbose(`routes path ${path} ${FS.existsSync(path)}`);
        if (!FS.existsSync(path)) return;

        const contents = FS.readdirSync(path).sort();

        for (const entry of contents) {
            const fullpath = Path.join(process.cwd(), path, entry);
            const { default: route } = await import(fullpath);
            this.app.use(route);
            logger.verbose(`router ${fullpath}`);
        }
    }
}

export default Server;
