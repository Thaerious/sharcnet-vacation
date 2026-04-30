import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync } from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import { DBInterface } from '../../server/DBInterface.js';

const EMPTY_DB = resolve('db/empty.db');

// Reusable fixture for request insertion
const REQ = {
    email:       'alice@example.com',
    start_date:  '2026-04-27T00:00:00.000Z',
    end_date:    '2026-05-01T00:00:00.000Z',
    duration:    'full',
    name:        'Alice Smith',
    institution: 'SHARCNET',
};

let dbi, dbPath;

beforeEach(() => {
    process.env.EMPTY_DB_PATH = EMPTY_DB;
    process.env.DB_DIR        = tmpdir();
    process.env.DB_NAME       = `test-${randomBytes(4).toString('hex')}.db`;
    dbPath = join(process.env.DB_DIR, process.env.DB_NAME);
    dbi = new DBInterface();
});

afterEach(() => {
    dbi.close();
    if (existsSync(dbPath)) rmSync(dbPath);
});

// --- constructor ---

describe('constructor', () => {
    it('creates the database file at the expected path', () => {
        expect(existsSync(dbPath)).toBe(true);
    });

    it('does not overwrite an existing database on re-instantiation', () => {
        const record = dbi.addRequest(REQ);
        dbi.close();

        // Re-open the same file
        const dbi2 = new DBInterface();
        expect(dbi2.getRequestById(record.id)).toBeDefined();
        dbi2.close();
    });
});

// --- generateHash ---

describe('generateHash', () => {
    it('returns a string of 32 characters by default', () => {
        expect(dbi.generateHash()).toHaveLength(32);
    });

    it('returns a string of the requested length', () => {
        expect(dbi.generateHash(16)).toHaveLength(16);
        expect(dbi.generateHash(64)).toHaveLength(64);
    });

    it('returns only base64url characters', () => {
        expect(dbi.generateHash()).toMatch(/^[A-Za-z0-9_-]+$/);
    });

    it('returns a different value on each call', () => {
        expect(dbi.generateHash()).not.toBe(dbi.generateHash());
    });
});

// --- addRequest ---

describe('addRequest', () => {
    it('returns the inserted record', () => {
        const record = dbi.addRequest(REQ);
        expect(record).toBeDefined();
    });

    it('stores all submitted fields', () => {
        const record = dbi.addRequest(REQ);
        expect(record.email).toBe(REQ.email);
        expect(record.name).toBe(REQ.name);
        expect(record.institution).toBe(REQ.institution);
        expect(record.duration).toBe(REQ.duration);
        expect(record.start_date).toBe(REQ.start_date);
        expect(record.end_date).toBe(REQ.end_date);
    });

    it('sets status to "pending"', () => {
        expect(dbi.addRequest(REQ).status).toBe('pending');
    });

    it('assigns a non-empty hash', () => {
        const record = dbi.addRequest(REQ);
        expect(record.hash).toBeTruthy();
    });

    it('assigns unique hashes to separate requests', () => {
        const a = dbi.addRequest(REQ);
        const b = dbi.addRequest({ ...REQ, start_date: '2026-06-01T00:00:00.000Z' });
        expect(a.hash).not.toBe(b.hash);
    });
});

// --- getRequestByHash ---

describe('getRequestByHash', () => {
    it('retrieves the record by hash', () => {
        const inserted = dbi.addRequest(REQ);
        const fetched  = dbi.getRequestByHash(inserted.hash);
        expect(fetched.id).toBe(inserted.id);
    });

    it('returns undefined for an unknown hash', () => {
        expect(dbi.getRequestByHash('nosuchhash')).toBeUndefined();
    });
});

// --- getRequestById ---

describe('getRequestById', () => {
    it('retrieves the record by id', () => {
        const inserted = dbi.addRequest(REQ);
        const fetched  = dbi.getRequestById(inserted.id);
        expect(fetched.hash).toBe(inserted.hash);
    });

    it('returns undefined for an unknown id', () => {
        expect(dbi.getRequestById(99999)).toBeUndefined();
    });
});

// --- hasRequest ---

describe('hasRequest', () => {
    it('returns true after a request is inserted', () => {
        dbi.addRequest(REQ);
        expect(dbi.hasRequest(REQ.email, REQ.start_date)).toBe(true);
    });

    it('returns false when no matching request exists', () => {
        expect(dbi.hasRequest(REQ.email, REQ.start_date)).toBe(false);
    });

    it('returns false when email matches but start_date does not', () => {
        dbi.addRequest(REQ);
        expect(dbi.hasRequest(REQ.email, '2099-01-01')).toBe(false);
    });
});

// --- updateStatusByHash ---

describe('updateStatusByHash', () => {
    it('updates the status of the matching record', () => {
        const record = dbi.addRequest(REQ);
        dbi.updateStatusByHash(record.hash, 'accepted');
        expect(dbi.getRequestByHash(record.hash).status).toBe('accepted');
    });

    it('leaves other fields unchanged', () => {
        const record = dbi.addRequest(REQ);
        dbi.updateStatusByHash(record.hash, 'rejected');
        const updated = dbi.getRequestByHash(record.hash);
        expect(updated.email).toBe(REQ.email);
        expect(updated.hash).toBe(record.hash);
    });

    it('reports zero changes for an unknown hash', () => {
        expect(dbi.updateStatusByHash('nosuchhash', 'accepted').changes).toBe(0);
    });
});

// --- addEmail / getAllRoles / getLocations ---

describe('addEmail', () => {
    it('inserts an email row retrievable by getAllRoles', () => {
        dbi.addEmail('waterloo', 'mgr@example.com', 'manager');
        const rows = dbi.getAllRoles('manager');
        expect(rows).toHaveLength(1);
        expect(rows[0].email).toBe('mgr@example.com');
    });
});

describe('getAllRoles', () => {
    beforeEach(() => {
        dbi.addEmail('waterloo', 'w-mgr@example.com', 'manager');
        dbi.addEmail('toronto',  't-mgr@example.com', 'manager');
        dbi.addEmail('waterloo', 'admin@example.com', 'admin');
    });

    it('returns all rows for a role when location is omitted', () => {
        expect(dbi.getAllRoles('manager')).toHaveLength(2);
    });

    it('filters by location when provided', () => {
        const rows = dbi.getAllRoles('manager', 'waterloo');
        expect(rows).toHaveLength(1);
        expect(rows[0].email).toBe('w-mgr@example.com');
    });

    it('returns an empty array when no rows match', () => {
        expect(dbi.getAllRoles('manager', 'nowhere')).toHaveLength(0);
    });
});

describe('getLocations', () => {
    it('returns distinct locations for the given role', () => {
        dbi.addEmail('waterloo', 'a@example.com', 'admin');
        dbi.addEmail('waterloo', 'b@example.com', 'admin');
        dbi.addEmail('toronto',  'c@example.com', 'admin');
        const locs = dbi.getLocations('admin');
        expect(locs.sort()).toEqual(['toronto', 'waterloo']);
    });

    it('returns an empty array when no rows match', () => {
        expect(dbi.getLocations('admin')).toHaveLength(0);
    });

    it('defaults to the "admin" role', () => {
        dbi.addEmail('waterloo', 'a@example.com', 'admin');
        expect(dbi.getLocations()).toHaveLength(1);
    });
});

// --- setUserInfo / getUserInfo / hasUserInfo ---

describe('hasUserInfo', () => {
    it('returns false before a user is set', () => {
        expect(dbi.hasUserInfo('nobody@example.com')).toBe(false);
    });

    it('returns true after a user is set', () => {
        dbi.setUserInfo({ email: 'alice@example.com', name: 'Alice', institution: 'SHARCNET' });
        expect(dbi.hasUserInfo('alice@example.com')).toBe(true);
    });
});

describe('getUserInfo', () => {
    it('retrieves the stored user record', () => {
        dbi.setUserInfo({ email: 'alice@example.com', name: 'Alice', institution: 'SHARCNET' });
        const user = dbi.getUserInfo('alice@example.com');
        expect(user.name).toBe('Alice');
        expect(user.institution).toBe('SHARCNET');
    });

    it('returns undefined for an unknown email', () => {
        expect(dbi.getUserInfo('nobody@example.com')).toBeUndefined();
    });
});

describe('setUserInfo', () => {
    it('replaces an existing user record on duplicate email', () => {
        dbi.setUserInfo({ email: 'alice@example.com', name: 'Alice',   institution: 'SHARCNET' });
        dbi.setUserInfo({ email: 'alice@example.com', name: 'Alice B', institution: 'Compute Ontario' });
        const user = dbi.getUserInfo('alice@example.com');
        expect(user.name).toBe('Alice B');
        expect(user.institution).toBe('Compute Ontario');
    });
});
