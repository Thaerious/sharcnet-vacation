import assert from "assert";
import { internationalizeDates, expandDatesInData, addURLsToData, addManagersToData, humanizeDates } from "../../server-src/helpers/buildData.js";

describe(`Test Build Data (buildData.js)`, function () {
    describe(`expandDatesInData`, function () {
        describe(`single day request`, function () {
            before(function () {
                const mockData = {
                    "start_date": "2023-10-13",
                    "end_date": "2023-10-12",
                    "name": "Freddie Mercury",
                    "institution": "western",
                    "email": "frar.test@gmail.com",
                    "duration": "full"
                }

                this.resultData = expandDatesInData(mockData);
            });

            it("weekday count is 1", function () {
                assert.strictEqual(this.resultData.weekday_count, 1);
            });
        });

        describe(`multi day request`, function () {
            before(function () {
                const mockData = {
                    "start_date": "2023-10-13",
                    "end_date": "2023-10-15",
                    "name": "Freddie Mercury",
                    "institution": "western",
                    "email": "frar.test@gmail.com",
                    "duration": "full"
                }

                this.resultData = expandDatesInData(mockData);
            });

            it("weekday count is 3", function () {
                console.log(this.resultData);
                assert.strictEqual(this.resultData.weekday_count, 3);
            });
        });
    });
});