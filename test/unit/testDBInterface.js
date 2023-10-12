import DBInterface from "../../server-src/DBInterface.js";
import assert from "assert";
import FS from "fs";
import args from "../../server-src/parseArgs.js";
import { mkdirif } from "@thaerious/utility";

const cwd = process.cwd();
process.env["DB_DIR"] = "test/db";
process.env["DB_NAME"] = "test.db";

/**
 * Remove test directory unless --no-clean flag is set.
 */
function clean() {
    if (!args[`no-clean`]) {
        // clean up test directory unless --no-clean is specified
        process.chdir(cwd);
        if (FS.existsSync(process.env["DB_DIR"])) FS.rmSync(process.env["DB_DIR"], { recursive: true });
    } else {
        console.log(`\n *** see test directory: ${process.env["DB_DIR"]}`);
    }
}

describe(`Test Database Interface Class`, function () {
    // before(init);
    after(clean);

    describe(`Create new database interface'`, function () {
        before(function () {
            this.dbi = new DBInterface();
        });

        it("creates a new file 'test.db'", function () {
            const actual = FS.existsSync("test/db/test.db");
            assert.ok(actual);
        });
    });

    describe(`Open database twice, no change in state'`, function () {
        before(function () {
            this.dbi = new DBInterface();
        });

        it("open twice", function () {
            this.dbi.open();
            this.dbi.open();
        });
    });

    describe(`Add entry to database`, function () {
        before(function () {
            const data1 = {
                "email" : "who@where.com",
                "start_date" : "2020-01-02",
                "end_date" : "2020-01-04",
                "duration" : "full",
                "name" : "Waldo Rivera",
                "institution" : "MIT"
            }

            const data2 = {
                "email" : "who@where.com",
                "start_date" : "2020-12-31",
                "end_date" : "2021-01-31",
                "duration" : "full",
                "name" : "Alto Soprano",
                "institution" : "Carnegie"
            }

            this.dbi = new DBInterface().open();
            this.addResult1 = this.dbi.addRequest(data1);
            this.addResult2 = this.dbi.addRequest(data2);
        });

        after(function () {
            this.dbi.close();
        });

        it("creates a new file 'test.db'", function () {
            this.row = this.dbi.addRequest("who@where.com", "2020-01-02", "2020-01-04", "full", "Waldo Rivera", "MIT");
            const actual = FS.existsSync("test/db/test.db");
            assert.ok(actual);
        });

        it("Poll database (#has) for entry that exists returns true", function () {
            const actual = this.dbi.hasRequest("who@where.com", "2020-01-02");
            assert.ok(actual);
        });

        it("Poll database (#has) for entry that doesn't exist returns false", function () {
            const actual = this.dbi.hasRequest("nope", "2020-01-02");
            assert.ok(!actual);
        });

        it("(#getRequestById) returns an data object", function () {
            const actual = this.dbi.getRequestById(this.addResult1.id);
            assert.deepEqual(actual, this.addResult1);
        });

        describe(`Update an entry's status`, function () {
            before(function () {
                this.dbi = new DBInterface().open();
                this.dbi.updateStatusByHash(this.row.hash, "accepted");
            });

            it("(#getRequestByHash) returns an object with status 'accepted'", function () {
                const actual = this.dbi.getRequestByHash(this.row.hash).status;
                const expected = "accepted";
                assert.strictEqual(actual, expected);
            });
        });
    });

    describe(`Roles`, function () {
        before(function () {
            this.dbi = new DBInterface().open();
        });

        it("adds the role (manager)", function () {
            const actual = this.dbi.addEmail("guelph", "manager@somewhere.com", "manager").changes;
            const expected = 1;
            assert.strictEqual(actual, expected);
        });

        it("add second manager", function () {
            const actual = this.dbi.addEmail("toronto", "mngr@there.com", "manager").changes;
            const expected = 1;
            assert.strictEqual(actual, expected);
        });

        it("retrieve all for managers for location 'guelph'", function () {
            const actual = this.dbi.getAllRoles("manager", "guelph");
            const expected = "manager@somewhere.com";
            assert.strictEqual(actual[0].email, expected);
        });

        it("retrieve all managers", function () {
            const actual = this.dbi.getAllRoles("manager");
            const expected0 = "frar.test+manager1@gmail.com"; // empty has this role
            const expected1 = "frar.test+manager2@gmail.com"; // empty has this role
            const expected2 = "manager@somewhere.com";        // added role for the test
            assert.strictEqual(actual[0].email, expected0);
            assert.strictEqual(actual[1].email, expected1);
            assert.strictEqual(actual[2].email, expected2);
        });

        it("retrieve admin for location 'guelph'", function () {
            const actual = this.dbi.getAllRoles("admin", "guelph");
            const expected = "frar.test+guelph@gmail.com";
            assert.strictEqual(actual[0].email, expected);
        });
    });

    describe(`Locations`, function () {
        before(function () {
            this.dbi = new DBInterface().open();
        });

        it("retrieve all locations for the admin role", function () {
            const actual = this.dbi.getLocations();
            assert.notStrictEqual(actual.indexOf("guelph"), -1);
            assert.notStrictEqual(actual.indexOf("waterloo"), -1);
            assert.strictEqual(actual.indexOf("not real"), -1);
        });
    });


    describe(`User Info`, function () {
        before(function () {
            this.dbi = new DBInterface().open();
        });

        it("set user info", function () {
            const actual = this.dbi.setUserInfo("who@where.com", "who whom", "university of where");
            assert.strictEqual(actual.changes, 1);
        });

        it("has user info: true", function () {
            const actual = this.dbi.hasUserInfo("who@where.com");
            assert.ok(actual);
        });

        it("has user info: false", function () {
            const actual = this.dbi.hasUserInfo("unknown@where.com");
            assert.ok(!actual);
        });

    });
});
