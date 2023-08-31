import logger from "../setupLogger.js";

/**
 * Use when rendering a page (ejs).
 * Will send the page when no rendering error occurs.
 * Otherwise throws an Error.
 */
export default function catchRenderingError(res) {
    return (err, html) => {
        if (err) {
            logger.log(err);
            throw new Error(err);
        } else {
            res.send(html);
        }
    }
}