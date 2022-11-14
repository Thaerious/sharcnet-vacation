import Express from "express";
import FS from "fs";
import Path from "path";
import logger from "../setupLogger.js";
import sass from "sass";
import { mkdirif } from "@thaerious/utility";

const router = Express.Router();
const srcDir = "client-src";
const destDir = "www/compiled";

router.use(`/*.css`, renderSCSS);

function renderSCSS(req, res, next) {
    if (!req.originalUrl.endsWith(`.css`)) return next();
    const parsed = Path.parse(req.originalUrl);    
    const src = Path.join(srcDir, parsed.dir, parsed.name + ".scss");
    const dest = Path.join(destDir, parsed.dir, parsed.name + ".css");

    const sassOptions = {
        loadPaths: [Path.resolve(process.cwd())],
    };

    const result = sass.compile(src, sassOptions);

    if (result) {
        mkdirif(dest);
        FS.writeFileSync(dest, result.css);
        logger.verbose(`\\_` + req.method + ` ` + req.originalUrl);
        logger.verbose(`  \\_ ${src}`);
        logger.verbose(`  \\_ ${dest}`);
    }

    return next();
}

export default router;
