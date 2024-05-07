import assert from "assert";
import { internationalizeDates, expandDatesInRecord, addURLsToData, addManagersToData, humanizeDates } from "../../server-src/helpers/buildData.js";
import { Console } from "console";

describe(`Test Build Data (buildData.js)`, function () {
    describe(`expandDatesInRecord`, function () {
        describe(`single day request`, function () {
            before(function () {
                // Adds three fields "weekday_count", "return_date", and "todays_date"
                // When the start date and the end date are the same the duration is 1 day
                const mockData = {
                    "start_date": "2023-10-13",
                    "end_date": "2023-10-13",
                    "name": "Freddie Mercury",
                    "institution": "western",
                    "email": "frar.test@gmail.com",
                    "duration": "full"
                }

                this.resultData = expandDatesInRecord(mockData);
            });

            it("weekday count is 1", function () {
                assert.strictEqual(this.resultData.weekday_count, 1);
            });
        });

        describe(`multi day request`, function () {
            before(function () {
                // Adds three fields "weekday_count", "return_date", and "todays_date"
                // When the end date is 2 days of the start date the duration is 3 days.
                const mockData = {
                    "start_date": "2023-10-11",
                    "end_date": "2023-10-13",
                    "name": "Freddie Mercury",
                    "institution": "western",
                    "email": "frar.test@gmail.com",
                    "duration": "full"
                }

                this.resultData = expandDatesInRecord(mockData);
            });

            it("weekday count is 3", function () {
                assert.strictEqual(this.resultData.weekday_count, 3);
            });
        });

        describe(`multi day request with weekends`, function () {
            before(function () {
                // Adds three fields "weekday_count", "return_date", and "todays_date"
                // The start date is a friday, the end date is a monday, the total weekday count is 2.
                const mockData = {
                    "start_date": "2023-10-13",
                    "end_date": "2023-10-16",
                    "name": "Freddie Mercury",
                    "institution": "western",
                    "email": "frar.test@gmail.com",
                    "duration": "full"
                }

                this.resultData = expandDatesInRecord(mockData);
            });

            it("weekday count is 2", function () {
                assert.strictEqual(this.resultData.weekday_count, 2);
            });
        });
    });
});