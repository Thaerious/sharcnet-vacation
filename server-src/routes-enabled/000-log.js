import express from "express";
import logger from "../setupLogger.js";
import { Exception } from "sass";

const router = express.Router();

router.use(`*`, (req, res, next) => {
    logger.log(req.method + ` ` + req.originalUrl);
    next();
});

export default router;