import { describe, it, expect } from 'vitest';
import { countWeekdays, nextWeekday } from '../../server/weekdays.js';

// Reference week (all UTC midnight):
//   Mon 2026-04-27  Tue 2026-04-28  Wed 2026-04-29
//   Thu 2026-04-30  Fri 2026-05-01  Sat 2026-05-02
//   Sun 2026-05-03  Mon 2026-05-04

const MON1 = '2026-04-27T00:00:00.000Z';
const TUE  = '2026-04-28T00:00:00.000Z';
const THU  = '2026-04-30T00:00:00.000Z';
const FRI  = '2026-05-01T00:00:00.000Z';
const SAT  = '2026-05-02T00:00:00.000Z';
const SUN  = '2026-05-03T00:00:00.000Z';
const MON2 = '2026-05-04T00:00:00.000Z';

describe('countWeekdays', () => {
    it('counts a single weekday as 1', () => {
        expect(countWeekdays(MON1, MON1)).toBe(1);
    });

    it('counts a single Saturday as 0', () => {
        expect(countWeekdays(SAT, SAT)).toBe(0);
    });

    it('counts a single Sunday as 0', () => {
        expect(countWeekdays(SUN, SUN)).toBe(0);
    });

    it('counts Mon to Fri as 5', () => {
        expect(countWeekdays(MON1, FRI)).toBe(5);
    });

    it('counts Fri to Mon (spanning a weekend) as 2', () => {
        expect(countWeekdays(FRI, MON2)).toBe(2);
    });

    it('counts Mon to Mon across one full weekend as 6', () => {
        expect(countWeekdays(MON1, MON2)).toBe(6);
    });

    it('returns 0 when end is before start', () => {
        expect(countWeekdays(FRI, MON1)).toBe(0);
    });

    it('accepts Date objects as well as strings', () => {
        expect(countWeekdays(new Date(MON1), new Date(FRI))).toBe(5);
    });

    it('does not mutate Date object inputs', () => {
        const start = new Date(MON1);
        const end   = new Date(FRI);
        const startTime = start.getTime();
        const endTime   = end.getTime();
        countWeekdays(start, end);
        expect(start.getTime()).toBe(startTime);
        expect(end.getTime()).toBe(endTime);
    });
});

describe('nextWeekday', () => {
    it('advances Monday to Tuesday', () => {
        const result = nextWeekday(new Date(MON1));
        expect(result.getUTCDay()).toBe(2);
        expect(result.toISOString()).toBe(TUE);
    });

    it('advances Thursday to Friday', () => {
        const result = nextWeekday(new Date(THU));
        expect(result.getUTCDay()).toBe(5);
        expect(result.toISOString()).toBe(FRI);
    });

    it('advances Friday to Monday, skipping the weekend', () => {
        const result = nextWeekday(new Date(FRI));
        expect(result.getUTCDay()).toBe(1);
        expect(result.toISOString()).toBe(MON2);
    });

    it('advances Saturday to Monday', () => {
        const result = nextWeekday(new Date(SAT));
        expect(result.getUTCDay()).toBe(1);
        expect(result.toISOString()).toBe(MON2);
    });

    it('advances Sunday to Monday', () => {
        const result = nextWeekday(new Date(SUN));
        expect(result.getUTCDay()).toBe(1);
        expect(result.toISOString()).toBe(MON2);
    });

    it('returns a Date object', () => {
        expect(nextWeekday(new Date(MON1))).toBeInstanceOf(Date);
    });

    it('does not mutate the input date', () => {
        const input = new Date(FRI);
        const originalTime = input.getTime();
        nextWeekday(input);
        expect(input.getTime()).toBe(originalTime);
    });
});
