import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { writeFileSync, rmSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';
import loadAsset from '../../server/loadAsset.js';

const testDir = join(tmpdir(), `loadAsset-${randomBytes(4).toString('hex')}`);

const files = {
    single:    join(testDir, 'single.txt'),
    multi:     join(testDir, 'multi.txt'),
    repeated:  join(testDir, 'repeated.txt'),
    plain:     join(testDir, 'plain.txt'),
    empty:     join(testDir, 'empty.txt'),
};

beforeAll(() => {
    mkdirSync(testDir);
    writeFileSync(files.single,   'Hello, ${name}!');
    writeFileSync(files.multi,    '${greeting}, ${name}!');
    writeFileSync(files.repeated, '${x} and ${x}');
    writeFileSync(files.plain,    'no placeholders here');
    writeFileSync(files.empty,    '');
});

afterAll(() => rmSync(testDir, { recursive: true }));

describe('loadAsset', () => {
    it('replaces a single placeholder', () => {
        expect(loadAsset(files.single, { name: 'Alice' })).toBe('Hello, Alice!');
    });

    it('replaces multiple different placeholders', () => {
        expect(loadAsset(files.multi, { greeting: 'Hi', name: 'Bob' })).toBe('Hi, Bob!');
    });

    it('replaces all occurrences of a repeated placeholder', () => {
        expect(loadAsset(files.repeated, { x: 'foo' })).toBe('foo and foo');
    });

    it('returns the text unchanged when pairs is empty', () => {
        expect(loadAsset(files.single, {})).toBe('Hello, ${name}!');
    });

    it('leaves unmatched placeholders as-is', () => {
        expect(loadAsset(files.single, { other: 'value' })).toBe('Hello, ${name}!');
    });

    it('returns plain text unchanged when there are no placeholders', () => {
        expect(loadAsset(files.plain, { name: 'Alice' })).toBe('no placeholders here');
    });

    it('handles an empty file', () => {
        expect(loadAsset(files.empty, { name: 'Alice' })).toBe('');
    });

    it('throws when the file does not exist', () => {
        expect(() => loadAsset(join(testDir, 'missing.txt'), {})).toThrow();
    });
});
