// logMiddleware.js

import logger from "../../setupLogger.js";
import chalk from "chalk";

export default function logMiddleware(req, res, next) {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    logger.debug(chalk.cyan(`→ ${method} ${originalUrl} | ip=${ip}`));

    // Log request body if present
    if (req.body && Object.keys(req.body).length > 0) {
        const sanitized = sanitizeBody(req.body);
        logger.debug(chalk.cyan(`  body=${JSON.stringify(sanitized)}`));
    }

    // Log query params if present
    if (req.query && Object.keys(req.query).length > 0) {
        logger.debug(chalk.cyan(`  query=${JSON.stringify(req.query)}`));
    }

    // Intercept res.json() to capture the response body before it's sent
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        res._responseBody = body;
        return originalJson(body);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode < 400 ? chalk.green : chalk.red;

        logger.debug(
            chalk.cyan(`← ${method} ${originalUrl}`) +
            ` ${statusColor(res.statusCode)} | ${duration}ms`
        );

        if (res._responseBody !== undefined) {
            logger.debug(chalk.cyan(`  response=${JSON.stringify(res._responseBody)}`));
        }
    });

    next();
}

// Redact sensitive fields so they don't appear in logs
const REDACTED_FIELDS = new Set(["password", "token", "secret", "authorization", "cookie"]);

function sanitizeBody(body) {
    return Object.fromEntries(
        Object.entries(body).map(([k, v]) =>
            REDACTED_FIELDS.has(k.toLowerCase()) ? [k, "[REDACTED]"] : [k, v]
        )
    );
}