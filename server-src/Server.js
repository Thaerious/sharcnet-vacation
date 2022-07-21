import dotenv from "dotenv";
dotenv.config();

import ParseArgs from "@thaerious/parseargs";
import parseArgsOptions from "./parseArgsOptions.js";
import { WidgetMiddleware } from "@html-widget/core";
const args = new ParseArgs().loadOptions(parseArgsOptions).run();
if (args.flags.cwd) process.chdir(args.flags.cwd);

import Express from "express";
import http from "http";
import submitHandler from "./routes/submitRoute.js";
import logger from "./setupLogger.js";
import rejectRoute from "./routes/rejectHandler.js";
import acceptRoute from "./routes/acceptHandler.js";
import acceptedRoute from "./routes/acceptedHandler.js";
import rejectedRoute from "./routes/rejectedHandler.js";

class Server {
    constructor() {
        const mwm = new WidgetMiddleware();
        this.app = Express();
        this.app.set(`views`, `client-src`);
        this.app.set(`view engine`, `ejs`);

        // ------------ ROUTES
        // this.app.use(`*`, (req, res, next) => {
        //     logger.standard(`${req.method} ${req.originalUrl}`);
        //     next();
        // });

        this.app.use(submitHandler);
        this.app.use(acceptRoute);
        this.app.use(acceptedRoute);        
        this.app.use(rejectRoute);
        this.app.use(rejectedRoute);

        this.app.use((req, res, next) => mwm.middleware(req, res, next));

        this.app.use(Express.static(`www/static`));
        this.app.use(Express.static(`www/compiled`));
        this.app.use(Express.static(`client-src`));

        this.app.use('/', (req, res) => {
            if (req.originalUrl == "/") res.redirect("/index");
            else {
                logger.standard(`404 ${req.originalUrl}`);
                res.statusMessage = `404 Page Not Found: ${req.originalUrl}`;
                res.status(404);
                res.send(`404: page not found`);
                res.end();                      
            }
        });
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
}

try {
    const server = new Server();
    server.start();
} catch (err) {
    console.error(err);
}
