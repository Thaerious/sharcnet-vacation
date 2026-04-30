import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import mkdirif from '../../server/mkdirif.js';

let testDir;

beforeEach(() => {
    testDir = join(tmpdir(), `mkdirif-${randomBytes(4).toString('hex')}`);
});

afterEach(() => {
    if (existsSync(testDir)) rmSync(testDir, { recursive: true });
});

describe('mkdirif — file path (no trailing slash)', () => {
    it('creates the parent directory', () => {
        const subdir = join(testDir, 'subdir');
        mkdirif(subdir, 'file.txt');
        expect(existsSync(subdir)).toBe(true);
    });

    it('creates nested parent directories recursively', () => {
        mkdirif(testDir, 'a', 'b', 'c', 'file.txt');
        expect(existsSync(join(testDir, 'a', 'b', 'c'))).toBe(true);
    });

    it('returns the joined path', () => {
        const result = mkdirif(testDir, 'subdir', 'file.txt');
        expect(result).toBe(join(testDir, 'subdir', 'file.txt'));
    });

    it('does not throw if the parent directory already exists', () => {
        mkdirif(testDir, 'subdir', 'first.txt');
        expect(() => mkdirif(testDir, 'subdir', 'second.txt')).not.toThrow();
    });

    it('returns the path without creating anything for a bare filename', () => {
        const result = mkdirif('file.txt');
        expect(result).toBe('file.txt');
    });
});

describe('mkdirif — directory path (trailing slash)', () => {
    it('creates the directory', () => {
        const dir = join(testDir, 'newdir') + '/';
        mkdirif(dir);
        expect(existsSync(dir)).toBe(true);
    });

    it('returns the joined path', () => {
        const dir = testDir + '/';
        expect(mkdirif(dir)).toBe(dir);
    });

    it('does not throw if the directory already exists', () => {
        const dir = testDir + '/';
        mkdirif(dir);
        expect(() => mkdirif(dir)).not.toThrow();
    });
});
