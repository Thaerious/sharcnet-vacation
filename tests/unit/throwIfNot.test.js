import { describe, it, expect } from 'vitest';
import throwIfNot from '../../server/throwIfNot.js';

describe('throwIfNot', () => {
    it('does not throw when all values are present', () => {
        expect(() => throwIfNot({ a: 1, b: 'hello' })).not.toThrow();
    });

    it('throws for an undefined value', () => {
        expect(() => throwIfNot({ myArg: undefined }))
            .toThrow("undefined value for 'myArg'");
    });

    it('throws for a null value', () => {
        expect(() => throwIfNot({ myArg: null }))
            .toThrow("null value for 'myArg'");
    });

    it('includes the field name in the error message', () => {
        expect(() => throwIfNot({ specificField: undefined }))
            .toThrow('specificField');
    });

    it('throws on the first missing field when multiple are missing', () => {
        // Object.entries preserves insertion order, so 'first' is checked first
        expect(() => throwIfNot({ first: undefined, second: undefined }))
            .toThrow('first');
    });

    it('throws for a missing field even when others are valid', () => {
        expect(() => throwIfNot({ good: 'value', bad: null }))
            .toThrow("null value for 'bad'");
    });

    it('does not throw for falsy-but-defined values', () => {
        expect(() => throwIfNot({ a: 0, b: '', c: false })).not.toThrow();
    });

    it('does not throw for an empty fields object', () => {
        expect(() => throwIfNot({})).not.toThrow();
    });
});
