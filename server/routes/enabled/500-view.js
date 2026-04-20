import express from "express";
import path from "path";
import FS from "fs"
import logger from "../../setupLogger.js";
import chalk from "chalk";
import CONST from "../../constants.js"
import Path from "path"

const router = express.Router();

const PUBLIC_ROUTES = ["/", "/index"];

async function serveView(req, res, next) {
    // Restrict paths to views (omit extensions)
    const ext = path.extname(req.originalUrl);
    if (ext) return next();
    
    // Restrict to views to those w/ a subdirectory
    // Otherwise it's an api endpoint
    const viewPath = Path.join(CONST.LOC.WWW, req.originalUrl)
    if (!FS.existsSync(viewPath)) {
        return next();
    }

    // Authenticate non public routes
    if (!PUBLIC_ROUTES.includes(req.path)){
        if (!req.isAuthenticated()) return res.redirect("/");
    }

    const name = req.params.name?.join("/") ?? "index";

    // Look for view index page
    const candidates = [
        [path.join(name, "index"), "ejs"],
        [path.join(name, "index"), "html"],
        [name, "ejs"],
        [name, "html"],
    ];

    for (const [view, engine] of candidates) {
        const fullpath = path.join(process.cwd(), "www", `${view}.${engine}`);
        if (FS.existsSync(fullpath)) {
            if (engine === "html") return res.sendFile(fullpath);
            logger.debug(chalk.green(`Serve view: ${fullpath}`));
            return res.render(view, { user: req.user ?? null });
        }
        logger.debug(chalk.red(`View index page not found: ${fullpath}`));
    }

    next();
}

router.get(`/`, serveView);
router.get(`/index`, serveView);
router.get(`/{*name}`, serveView);

export default router;