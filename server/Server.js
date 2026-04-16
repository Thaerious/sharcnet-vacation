// Server.js
import Express from "express";
import http from "http";
import logger from "./setupLogger.js";
import FS from "fs";
import Path from "path";
import chalk from "chalk";
import { waitForEmails } from "./email_interface.js";

class Server {
    routes = [];
    stopping = false

    constructor() {
        this.app = Express();
        this.app.set("views", Path.join("www"));
        this.app.set("view engine", "ejs");
    }

    async start() {
        await this.loadRoutes();
        this.startHTTP();
        return this;
    }

    startHTTP(port = process.env.PORT ?? 3000, ip = "0.0.0.0") {
        this.server = http.createServer(this.app);

        this.server.on("error", err => {
            logger.error(err);
            process.exit(1);
        });

        this.server.listen(port, ip, () => {
            logger.debug(chalk.green(`HTTP listening on ${ip}:${port}`));
        });

        process.on("SIGINT",  () => this.stop());
        process.on("SIGTERM", () => this.stop());

        return this;
    }

    async stop() {
        if (this.stopping) return;
        this.stopping = true;        

        logger.debug(chalk.green("Shutting down server."));

        await new Promise(resolve => this.server.close(resolve));

        for (const route of this.routes) {
            if (typeof route.close === "function") {
                await route.close();
            }
        }

        await waitForEmails();
        process.exit(0);
    }

    async loadRoutes(path = process.env.ROUTES_PATH) {
        if (!path) {
            logger.error("ROUTES_PATH is not set in environment");
            process.exit(1);
        }

        if (!FS.existsSync(path)) {
            logger.debug(`Routes path not found: ${path}`);
            return;
        }

        const entries = FS.readdirSync(path).sort();
        let routecount = 0;

        for (const entry of entries) {
            if (!entry.endsWith(".js")) continue;
            const fullpath = Path.join(process.cwd(), path, entry);

            try {
                const { default: route } = await import(fullpath);
                this.app.use(route);
                this.routes.push(route);
                routecount++;
                logger.debug(chalk.blue(`Loaded route: ${fullpath}`));
            } catch (err) {
                logger.error(chalk.red(`Failed to load route: ${fullpath}`));
                logger.error(err);
                await this.stop();
            }            
        }
        logger.debug(chalk.blue(`Loaded Route Count: ${routecount}`));
    }
}

export default Server;