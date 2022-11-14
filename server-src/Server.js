import dotenv from "dotenv";
dotenv.config();

import ParseArgs from "@thaerious/parseargs";
import parseArgsOptions from "./parseArgsOptions.js";
const args = new ParseArgs().loadOptions(parseArgsOptions).run();
if (args.flags.cwd) process.chdir(args.flags.cwd);

import Express from "express";
import http from "http";
import CONST from "./constants.js";
import logger from "./setupLogger.js";
import FS from "fs";
import Path from "path";

class Server {
    constructor() {
        this.app = Express();
        this.app.set(`views`, `client-src`);
        this.app.set(`view engine`, `ejs`);
        this.loadRoutes();
    }

    start(port = 8000, ip = `0.0.0.0`) {
        this.server = http.createServer(this.app);
        this.server.listen(port, ip, () => {
            logger.standard(`Listening on port ${port}`);
        });

        process.on(`SIGINT`, () => this.stop(this.server));
        process.on(`SIGTERM`, () => this.stop(this.server));
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

try {
    const server = new Server();
    server.start();
} catch (err) {
    console.error(err);
}
