import FS, { mkdir } from "fs";
import Path from "path";
import sqlite3 from "better-sqlite3";
import { mkdirif } from "@thaerious/utility";

class DBInterface {
    static DB_DIR = "db";
    static EMPTY_DB_FN = "empty.db";
    static PRODUCTION_DB = "production.db";

    constructor(filename = DBInterface.PRODUCTION_DB) {
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

    /**
     * Add a new request to the requests table.
     * @param {*} data
     * @returns 
     */
    addRequest(data) {
        const sql = "INSERT INTO requests (email, start_date, end_date, duration, name, institution, status, hash) values (?, ?, ?, ?, ?, ?, ?, ?)";
        const stmt = this.db.prepare(sql);
        const hash = this.generateHash();
        
        stmt.run(data.email, data.start_date, data.end_date, data.duration, data.name, data.institution, "pending", hash);        
        return hash;
    }

    hasRequest(email, start) {
        const sql = "SELECT * FROM requests where email = ? AND start_date = ?";
        const stmt = this.db.prepare(sql);
        const results = stmt.get(email, start);
        return results !== undefined;
    }

    /**
     * Select the vacation request with matching 'hash'
     * @param {string} hash 
     * @returns 
     */
    getRequest(hash) {
        const sql = "SELECT * FROM requests where hash = ?";
        const stmt = this.db.prepare(sql);
        return stmt.get(hash);
    }

    update(hash, status){
        const sql = "UPDATE requests SET status = ? where hash = ?";
        const stmt = this.db.prepare(sql);
        return stmt.run(status, hash);
    }

    addRole(location, email, role = "admin"){
        const sql = "INSERT INTO emails (email, location, role) values (?, ?, ?)";
        const stmt = this.db.prepare(sql);
        return stmt.run(email, location, role);
    }

    /**
     * Retrieve all rows from a specified location & role.
     * Omit location to return all rows with the specified role.
     * @param {string} location 
     * @param {string} role 
     * @returns email rows array
     */
    getAllRoles(role, location) {
        if (!location) return this._getAllRoles(role);

        const sql = "SELECT * FROM emails where location = ? AND role = ?";
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(location, role);

        return rows;
    }

    _getAllRoles(role){
        const sql = "SELECT * FROM emails where role = ?";
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(role);
        return rows;
    }

    /**
     * Retrieve all unique locations for a given role.
     * @param {string} role 
     * @returns 
     */
    getLocations(role = "admin"){
        const sql = "SELECT DISTINCT location FROM emails WHERE role = ?"
        const stmt = this.db.prepare(sql);
        const rows = stmt.all(role);

        const r = [];
        for(const row of rows){
            r.push(row.location);
        }

        return r;
    }

    generateHash(n = 32){
        let r = '';
        let c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let l = c.length;
        while (r.length < n){
            r += c.charAt(Math.floor(Math.random() * l));
        }
        return r;
    }

    hasUserInfo(email) {
        const sql = "SELECT * FROM users WHERE email = ?"
        const stmt = this.db.prepare(sql);
        return stmt.get(email) != undefined;
    }

    getUserInfo(email) {
        const sql = "SELECT * FROM users WHERE email = ?"
        const stmt = this.db.prepare(sql);
        return stmt.get(email);
    }

    setUserInfo({email, name, institution}) {
        const sql = "INSERT OR REPLACE INTO users (email, name, institution) VALUES (?, ?, ?)"
        const stmt = this.db.prepare(sql);
        return stmt.run(email, name, institution);
    }    
}

export default DBInterface;
