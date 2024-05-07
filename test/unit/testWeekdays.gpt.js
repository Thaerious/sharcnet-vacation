// Import the functions to test
import { countWeekdays, nextWeekday } from "../../server-src/helpers/weekdays.js";
import { expect } from 'chai';

describe('Weekday Functions Tests', () => {
    // Tests for countWeekdays function
    describe('countWeekdays', () => {
        it('should correctly count weekdays between two dates', () => {
            expect(countWeekdays('2024-05-01', '2024-05-07')).to.equal(5); // May 1-7, 2024 includes one weekend
        });

        it('should return 0 when the date range includes only weekends', () => {
            expect(countWeekdays('2024-05-04', '2024-05-05')).to.equal(0); // May 4-5, 2024 is a weekend
        });

        it('should handle the same start and end date if it is a weekday', () => {
            expect(countWeekdays('2024-05-01', '2024-05-01')).to.equal(1); // May 1, 2024 is a Wednesday
        });

        it('should handle the same start and end date if it is a weekend', () => {
            expect(countWeekdays('2024-05-04', '2024-05-04')).to.equal(0); // May 4, 2024 is a Saturday
        });
    });

    // Tests for nextWeekday function
    describe('nextWeekday', () => {
        it('should find the next weekday if the given date is a weekend', () => {
            expect(nextWeekday('2024-05-04').toDateString()).to.equal(new Date('2024-05-06').toDateString()); // May 4, 2024 is a Saturday
        });

        it('should increment by one day if the given date is a weekday', () => {
            expect(nextWeekday('2024-05-01').toDateString()).to.equal(new Date('2024-05-02').toDateString()); // May 1, 2024 is a Wednesday
        });

        it('should continue to the next weekday when multiple weekend days follow', () => {
            expect(nextWeekday('2024-05-03').toDateString()).to.equal(new Date('2024-05-06').toDateString()); // May 3, 2024 is a Friday
        });
    });
});
