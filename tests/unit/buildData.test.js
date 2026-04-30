import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
    internationalizeDates,
    expandDatesInRecord,
    humanizeDates,
    addURLsToData,
    addManagersToData,
} from '../../server/buildData.js';

// Reference dates (all UTC midnight, verified weekdays):
//   Mon 2026-04-27, Tue 2026-04-28, Thu 2026-04-30, Fri 2026-05-01, Mon 2026-05-04

describe('internationalizeDates', () => {
    it('appends T00:00:00 to start_date and end_date', () => {
        const result = internationalizeDates({ start_date: '2026-04-27', end_date: '2026-05-01' });
        expect(result.start_date).toBe('2026-04-27T00:00:00');
        expect(result.end_date).toBe('2026-05-01T00:00:00');
    });

    it('preserves other fields', () => {
        const result = internationalizeDates({
            start_date: '2026-04-27', end_date: '2026-05-01',
            name: 'Alice', duration: 'full',
        });
        expect(result.name).toBe('Alice');
        expect(result.duration).toBe('full');
    });

    it('does not mutate the input object', () => {
        const input = { start_date: '2026-04-27', end_date: '2026-05-01' };
        internationalizeDates(input);
        expect(input.start_date).toBe('2026-04-27');
        expect(input.end_date).toBe('2026-05-01');
    });
});

describe('expandDatesInRecord', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2026-04-30T12:00:00.000Z'));
    });
    afterEach(() => vi.useRealTimers());

    describe('duration: full', () => {
        it('counts Mon–Fri as 5 weekdays', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-05-01T00:00:00.000Z',
                duration: 'full',
            });
            expect(result.weekday_count).toBe(5);
        });

        it('counts a single weekday as 1', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-04-27T00:00:00.000Z',
                duration: 'full',
            });
            expect(result.weekday_count).toBe(1);
        });

        it('counts weekdays across a full weekend (Mon to next Mon = 6)', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',  // Mon
                end_date:   '2026-05-04T00:00:00.000Z',  // Mon
                duration: 'full',
            });
            expect(result.weekday_count).toBe(6);
        });

        it('clamps end_date to start_date when end is before start', () => {
            const result = expandDatesInRecord({
                start_date: '2026-05-01T00:00:00.000Z',
                end_date:   '2026-04-27T00:00:00.000Z',  // earlier than start
                duration: 'full',
            });
            expect(result.weekday_count).toBe(1);
            expect(result.end_date).toBe(result.start_date);
        });

        it('sets return_date to the next weekday after a Friday end', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-05-01T00:00:00.000Z',  // Fri
                duration: 'full',
            });
            const returnDate = new Date(result.return_date);
            expect(returnDate.getUTCDay()).toBe(1);    // Monday
            expect(returnDate.getUTCDate()).toBe(4);   // May 4
        });

        it('sets return_date to next day for a mid-week end', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-04-28T00:00:00.000Z',  // Tue
                duration: 'full',
            });
            const returnDate = new Date(result.return_date);
            expect(returnDate.getUTCDay()).toBe(3);    // Wednesday
        });

        it('converts start_date and end_date to ISO strings', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-05-01T00:00:00.000Z',
                duration: 'full',
            });
            expect(result.start_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
            expect(result.end_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
            expect(result.return_date).toMatch(/^\d{4}-\d{2}-\d{2}T/);
        });

        it('adds todays_date matching the pinned system time', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-05-01T00:00:00.000Z',
                duration: 'full',
            });
            expect(result.todays_date).toBe(new Date('2026-04-30T12:00:00.000Z').toISOString());
        });

        it('preserves other record fields', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-05-01T00:00:00.000Z',
                duration: 'full',
                name: 'Alice',
                institution: 'SHARCNET',
            });
            expect(result.name).toBe('Alice');
            expect(result.institution).toBe('SHARCNET');
        });
    });

    describe('duration: am / pm', () => {
        it('sets weekday_count to 0.5 for am', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-04-27T00:00:00.000Z',
                duration: 'am',
            });
            expect(result.weekday_count).toBe(0.5);
        });

        it('sets weekday_count to 0.5 for pm', () => {
            const result = expandDatesInRecord({
                start_date: '2026-04-27T00:00:00.000Z',
                end_date:   '2026-04-27T00:00:00.000Z',
                duration: 'pm',
            });
            expect(result.weekday_count).toBe(0.5);
        });

        it('sets return_date equal to end_date — not the next weekday', () => {
            const result = expandDatesInRecord({
                start_date: '2026-05-01T00:00:00.000Z',  // Fri
                end_date:   '2026-05-01T00:00:00.000Z',
                duration: 'am',
            });
            // For a half-day, staff return same day — no weekend-skip advance
            expect(new Date(result.return_date).getTime())
                .toBe(new Date(result.end_date).getTime());
            expect(new Date(result.return_date).getUTCDay()).toBe(5);  // still Friday
        });
    });
});

describe('humanizeDates', () => {
    const isoData = {
        start_date:  '2026-04-27T00:00:00.000Z',
        end_date:    '2026-05-01T00:00:00.000Z',
        return_date: '2026-05-04T00:00:00.000Z',
        todays_date: '2026-04-30T00:00:00.000Z',
        name: 'Alice',
    };

    it('converts all four date fields from ISO strings to human-readable strings', () => {
        const result = humanizeDates(isoData);
        for (const field of ['start_date', 'end_date', 'return_date', 'todays_date']) {
            expect(typeof result[field]).toBe('string');
            expect(result[field]).not.toMatch(/T\d{2}:/);  // no ISO T separator
            expect(result[field]).toContain('2026');
        }
    });

    it('preserves other fields', () => {
        const result = humanizeDates(isoData);
        expect(result.name).toBe('Alice');
    });

    it('does not mutate the input object', () => {
        const input = { ...isoData };
        humanizeDates(input);
        expect(input.start_date).toBe(isoData.start_date);
    });
});

describe('addURLsToData', () => {
    beforeEach(() => {
        process.env.SERVER_NAME = 'https://vacation.example.com';
    });
    afterEach(() => {
        delete process.env.SERVER_NAME;
    });

    it('adds accepted_url pointing to /accept with the hash', () => {
        const result = addURLsToData({ name: 'Alice' }, 'abc123');
        const url = new URL(result.accepted_url);
        expect(url.pathname).toBe('/accept');
        expect(url.searchParams.get('hash')).toBe('abc123');
    });

    it('adds rejected_url pointing to /reject with the hash', () => {
        const result = addURLsToData({ name: 'Alice' }, 'abc123');
        const url = new URL(result.rejected_url);
        expect(url.pathname).toBe('/reject');
        expect(url.searchParams.get('hash')).toBe('abc123');
    });

    it('uses SERVER_NAME as the base', () => {
        const result = addURLsToData({}, 'xyz');
        expect(result.accepted_url).toContain('vacation.example.com');
        expect(result.rejected_url).toContain('vacation.example.com');
    });

    it('produces different accepted_url and rejected_url', () => {
        const result = addURLsToData({}, 'xyz');
        expect(result.accepted_url).not.toBe(result.rejected_url);
    });

    it('preserves other record fields', () => {
        const result = addURLsToData({ name: 'Alice', email: 'alice@example.com' }, 'h1');
        expect(result.name).toBe('Alice');
        expect(result.email).toBe('alice@example.com');
    });
});

describe('addManagersToData', () => {
    it('adds managers array to the record', () => {
        const managers = ['mgr1@example.com', 'mgr2@example.com'];
        const result = addManagersToData({ name: 'Alice' }, managers);
        expect(result.managers).toStrictEqual(managers);
    });

    it('accepts an empty managers array', () => {
        const result = addManagersToData({ name: 'Alice' }, []);
        expect(result.managers).toStrictEqual([]);
    });

    it('preserves other record fields', () => {
        const result = addManagersToData({ name: 'Alice', duration: 'full' }, []);
        expect(result.name).toBe('Alice');
        expect(result.duration).toBe('full');
    });

    it('does not mutate the input record', () => {
        const record = { name: 'Alice' };
        addManagersToData(record, ['mgr@example.com']);
        expect(record.managers).toBeUndefined();
    });
});
