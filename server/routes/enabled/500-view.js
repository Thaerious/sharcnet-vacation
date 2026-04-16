import express from "express";
import path from "path";
import FS from "fs"
import logger from "../../setupLogger.js";
import chalk from "chalk";

const router = express.Router();

router.use(`/{*name}`, async (req, res, next) => {
    const ext = path.extname(req.originalUrl);
    if (ext) return next();

    const name = req.params.name?.join("/") ?? "index";
    const base = path.join(process.cwd(), "www", name);

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
            logger.debug(chalk.green(`View index page found: ${fullpath}`));
            return res.render(view, {user: req.user ?? null});
        }
        logger.debug(chalk.red(`View index page not found: ${fullpath}`));
    }

    next();
});

export default router;