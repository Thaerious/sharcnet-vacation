// DBInterface.js

import FS from "fs";
import Path from "path";
import sqlite3 from "better-sqlite3";
import crypto from "crypto";
import mkdirif from "./mkdirif.js"

class DBInterface {
    constructor() {
        const destination = mkdirif(
            process.env.DB_DIR,
            process.env.DB_NAME
        );

        const source = Path.join(process.env.EMPTY_DB_PATH);
        if (!FS.existsSync(destination)) {
            FS.copyFileSync(source, destination);
        }

        this.db = new sqlite3(destination, {
            verbose: process.env.DB_ENV === "debug" ? console.log : undefined
        });
    }


    /**
     * Add a new vacation request to the requests table.
     * This would normally originate from the user.
     * @param {*} data
     * @returns
     */
    addRequest(data) {
        const insert = this.db.transaction((data) => {
            const sql = "INSERT INTO requests (email, start_date, end_date, duration, name, institution, status, hash) values (?, ?, ?, ?, ?, ?, ?, ?)";
            const stmt = this.db.prepare(sql);
            const hash = this.generateHash();
            stmt.run(data.email, data.start_date, data.end_date, data.duration, data.name, data.institution, "pending", hash);
            return this.getRequestByHash(hash);
        });

        return insert(data);
    }

    /**
     * Determine if a vacation request exists for the user on the given date.
     */
    hasRequest(email, start) {
        const sql = "SELECT * FROM requests where email = ? AND start_date = ?";
        const stmt = this.db.prepare(sql);
        const results = stmt.get(email, start);
        return results !== undefined;
    }

    /**
     * Retrieve a vacation request with matching 'hash'.
     * @param {string} hash
     * @returns
     */
    getRequestByHash(hash) {
        const sql = "SELECT * FROM requests where hash = ?";
        const stmt = this.db.prepare(sql);
        return stmt.get(hash);
    }

    /**
     * Retrieve a vacation request with matching 'hash'.
     * @param {string} hash
     * @returns
     */
    getRequestById(id) {
        const sql = "SELECT * FROM requests where id = ?";
        const stmt = this.db.prepare(sql);
        return stmt.get(id);
    }

    /**
     * Update the status of an existing vacation request.
     */
    updateStatusByHash(hash, status) {
        const sql = "UPDATE requests SET status = ? where hash = ?";
        const stmt = this.db.prepare(sql);
        return stmt.run(status, hash);
    }

    /**
     * Retrieve all rows from a specified location & role.
     * Omit location to return all rows with the specified role.
     * @param {string} location
     * @param {string} role
     * @returns email rows array
     */
    getAllRoles(role, location) {
        if (!location) {
            const sql = "SELECT * FROM emails where role = ?";
            const stmt = this.db.prepare(sql);
            const rows = stmt.all(role);
            return rows;
        }
        else {
            const sql = "SELECT * FROM emails where location = ? AND role = ?";
            const stmt = this.db.prepare(sql);
            const rows = stmt.all(location, role);
            return rows;
        }
    }

    /**
     * Add a new entry to into the email table.
     */
    addEmail(location, email, role) {
        const sql = "INSERT INTO emails (email, location, role) values (?, ?, ?)";
        const stmt = this.db.prepare(sql);
        return stmt.run(email, location, role);
    }

    /**
     * Retrieve all unique locations for a given role.
     * @param {string} role
     * @returns
     */
    getLocations(role = "admin") {
        const sql = "SELECT DISTINCT location FROM emails WHERE role = ?"
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(role);

        const r = [];
        for (const row of rows) {
            r.push(row.location);
        }

        return r;
    }

    /**
     * Create an alpha-numeric hash of length 'n'.
     */
    generateHash(n = 32) {
        return crypto.randomBytes(n).toString("base64url").slice(0, n);
    }

    /**
     * Determine if 'email' has been previously used.
     */
    hasUserInfo(email) {
        const sql = "SELECT * FROM users WHERE email = ?"
        const stmt = this.db.prepare(sql);
        return stmt.get(email) != undefined;
    }

    /**
     * Retrieve user information by 'email'.
     * Returns an object with the fields of email table.
     * {email, role, location}
     */
    getUserInfo(email) {
        const sql = "SELECT * FROM users WHERE email = ?"
        const stmt = this.db.prepare(sql);
        return stmt.get(email);
    }

    /**
     * Insert/Update user name and institution by 'email'.
     */
    setUserInfo({ email, name, institution }) {
        const sql = "INSERT OR REPLACE INTO users (email, name, institution) VALUES (?, ?, ?)"
        const stmt = this.db.prepare(sql);
        return stmt.run(email, name, institution);
    }

    close() {
        this.db.close();
    }
}

const dbi = new DBInterface();
export { dbi, DBInterface };
export default dbi;