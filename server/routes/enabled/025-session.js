// 25-session.js

import Express from "express";
import sessions from "express-session";
import sqlite3 from "better-sqlite3";
import store from "better-sqlite3-session-store";
import path from "path";
import FS from "fs";
import chalk from "chalk";
import logger from "../../setupLogger.js"; // adjust path as needed

// build session db path
const dbPath = process.env.SESSION_DB ?? "db/sessions.db";
const dbDir = path.dirname(dbPath);
FS.mkdirSync(dbDir, { recursive: true });
logger.debug(chalk.blue(`Created path: ${dbDir}`));

const router = Express.Router();
const ONE_DAY = 1000 * 60 * 60 * 24;
const MINUTES_15 = 1000 * 60 * 15;

const db = new sqlite3(process.env.SESSION_DB, {
    verbose: process.env.DB_SESS_ENV === "debug" ? console.log : undefined
});

const SqliteStore = store(sessions);

if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is not set");

router.use("/{*path}", sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    cookie: {
        maxAge: ONE_DAY,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    },
    resave: false,
    store: new SqliteStore({
        client: db,
        expired: {
            clear: true,
            intervalMs: MINUTES_15
        }
    })
}));

export default router;