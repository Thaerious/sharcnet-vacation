import express from "express";
import path from "path";
import FS from "fs"
import logger from "../../setupLogger.js";
import chalk from "chalk";
import CONST from "../../constants.js"
import Path from "path"

const router = express.Router();

const PUBLIC_ROUTES = ["/", "/index"];

async function serveIndex(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/landing");
    }

    
    // Restrict to views to those w/ a subdirectory
    // Otherwise it's an api endpoint
    const viewPath = Path.join(CONST.LOC.WWW, req.originalUrl)
    if (!FS.existsSync(viewPath)) {
        return next();
    }

    const fullpath = path.join(process.cwd(), "www", "index", `index.ejs`);    

    if (FS.existsSync(fullpath)) {
            logger.debug(chalk.green(`Serve view: ${fullpath}`));
            return res.render(fullpath);        
    }
    
    logger.debug(chalk.red(`View index page not found: ${fullpath}`));
}

router.get(`/`, serveIndex);
router.get(`/index`, serveIndex);

export default router;