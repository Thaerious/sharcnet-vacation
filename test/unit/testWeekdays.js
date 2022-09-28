import assert from "assert";
import {countWeekdays, nextWeekday } from "../../server-src/helpers/weekdays.js";

describe(`Test Count Weekdays Function`, function () {
    
    describe(`Count 5 days Monday to Friday`, function () {
        it("returns 5", function () {
            const from = new Date(2022, 8, 26);
            const to = new Date(2022, 8, 30);
            const actual = countWeekdays(from, to);
            const expected = 5;
            assert.strictEqual(actual, expected);
        });
    });

    describe(`Count 2 weeks Sunday to Saturday`, function () {
        it("returns 10", function () {
            const from = new Date(2022, 8, 4);
            const to = new Date(2022, 8, 17);
            const actual = countWeekdays(from, to);
            const expected = 10;
            assert.strictEqual(actual, expected);
        });
    });    

    describe(`Count 1 Day`, function () {
        it("returns 1", function () {
            const from = new Date(2022, 8, 27);
            const to = new Date(2022, 8, 27);
            const actual = countWeekdays(from, to);
            const expected = 1;
            assert.strictEqual(actual, expected);
        });
    });  
    
    describe(`Count 2 Days`, function () {
        it("returns 2", function () {
            const from = new Date(2022, 8, 27);
            const to = new Date(2022, 8, 28);
            const actual = countWeekdays(from, to);
            const expected = 2;
            assert.strictEqual(actual, expected);
        });
    });    

    describe(`Reversed Dates`, function () {
        it("returns 0", function () {
            const from = new Date(2022, 8, 17);
            const to = new Date(2022, 8, 4);
            const actual = countWeekdays(from, to);
            const expected = 0;
            assert.strictEqual(actual, expected);
        });
    });  

    describe(`Next Weekday from a Monday`, function () {
        it("returns the next day", function () {
            const from = new Date(2022, 8, 5);
            const actual = nextWeekday(from);
            const expected = new Date(2022, 8, 6);
            assert.deepStrictEqual(actual, expected);
        });
    });   
    
    describe(`Next Weekday from a Saturday`, function () {
        it("returns the following monday", function () {
            const from = new Date(2022, 8, 10);
            const actual = nextWeekday(from);
            const expected = new Date(2022, 8, 12);
            assert.deepStrictEqual(actual, expected);
        });
    });  
    
    describe(`Next Weekday from a Sunday`, function () {
        it("returns the following monday", function () {
            const from = new Date(2022, 8, 11);
            const actual = nextWeekday(from);
            const expected = new Date(2022, 8, 12);
            assert.deepStrictEqual(actual, expected);
        });
    });    

    describe(`Next Weekday from a Friday`, function () {
        it("returns the following monday", function () {
            const from = new Date(2022, 8, 9);
            const actual = nextWeekday(from);
            const expected = new Date(2022, 8, 12);
            assert.deepStrictEqual(actual, expected);
        });
    });     
});
