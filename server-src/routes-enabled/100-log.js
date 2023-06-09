import express from "express";
import logger from "../setupLogger.js";

const router = express.Router();

router.use(`*`, (req, res, next) => {
    logger.log(req.method + ` ` + req.originalUrl);
    next();
});

export default router;