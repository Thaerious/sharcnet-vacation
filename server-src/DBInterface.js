import FS, { mkdir } from "fs";
import Path from "path";
import sqlite3 from "better-sqlite3";
import { mkdirif } from "@thaerious/utility";

class DBInterface {
    static DB_DIR = "db";
    static EMPTY_DB_FN = "empty.db";

    constructor(filename = "requests.db") {
        const source = Path.join(DBInterface.DB_DIR, DBInterface.EMPTY_DB_FN);
        const dest = Path.join(DBInterface.DB_DIR, filename);
        if (!FS.existsSync(dest)) FS.copyFileSync(source, mkdirif(dest));
        this.dbPath = dest;
    }

    open() {
        if (this.db) return this;
        this.db = new sqlite3(this.dbPath);
        return this;
    }

    close() {
        this.db.close();
        this.db = undefined;
    }

    add(email, start, end, type, name, inst) {
        const sql = "INSERT INTO requests (email, start_date, end_date, type, name, institution, status)" + "values (?, ?, ?, ?, ?, ?, ?)";
        const stmt = this.db.prepare(sql);
        stmt.run(email, start, end, type, name, inst, "pending");
    }

    has(email, start) {
        const sql = "SELECT * FROM requests where email = ? AND start_date = ?";
        const stmt = this.db.prepare(sql);
        const results = stmt.get(email, start);
        return results !== undefined;
    }

    get(email, start) {
        const sql = "SELECT * FROM requests where email = ? AND start_date = ?";
        const stmt = this.db.prepare(sql);
        return stmt.get(email, start);
    }

    update(email, start, status){
        const sql = "UPDATE requests SET status = ? where email = ? AND start_date = ?";
        const stmt = this.db.prepare(sql);
        return stmt.run(status, email, start);
    }
}

export default DBInterface;
