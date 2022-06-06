import DBInterface from "../server-src/DBInterface.js";
import assert from "assert";
import FS from "fs";
import Path from "path";
import ParseArgs from "@thaerious/parseargs";
import { mkdirif } from "@thaerious/utility";
const args = new ParseArgs().run();

const cwd = process.cwd();
const TEST_DIRECTORY = "test/mock";

function init() {
    if (!process.cwd().endsWith(TEST_DIRECTORY)) {
        if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });

        const dest = mkdirif(TEST_DIRECTORY, "db", "empty.db");
        FS.copyFileSync("db/empty.db", mkdirif(TEST_DIRECTORY, "db", "empty.db"));
        FS.copyFileSync("db/empty.db", "test/mock/db/empty.db");

        FS.mkdirSync(TEST_DIRECTORY, { recursive: true });
        process.chdir(TEST_DIRECTORY);
    }
}

/**
 * Remove test directory unless --no-clean flag is set.
 */
function clean() {
    if (!args.flags[`no-clean`]) {
        // clean up test directory unless --no-clean is specified
        process.chdir(cwd);
        if (FS.existsSync(TEST_DIRECTORY)) FS.rmSync(TEST_DIRECTORY, { recursive: true });
    } else {
        console.log("\n *** see test directory: test/temp");
    }
}

describe(`Test Database Interface Class`, function () {
    before(init);
    after(clean);

    describe(`Create new database interface'`, function () {
        before(function () {
            this.dbi = new DBInterface();
        });

        it("creates a new file 'requests.db'", function () {
            const actual = FS.existsSync("db/requests.db");
            assert.ok(actual);
        });
    });

    describe(`Add entry to database`, function () {
        before(function () {
            this.dbi = new DBInterface().open();
            this.dbi.add("who@where.com", "2020-01-02", "2020-01-04", "full", "Waldo Rivera", "MIT");
            this.dbi.add("who@where.com", "2020-12-31", "2021-01-31", "full", "Alto Soprano", "Carnegie");
        });

        after(function () {
            this.dbi.close();
        });

        it("creates a new file 'requests.db'", function () {
            this.hash = this.dbi.add("who@where.com", "2020-01-02", "2020-01-04", "full", "Waldo Rivera", "MIT");
            const actual = FS.existsSync("db/requests.db");
            assert.ok(actual);
        });

        it("Poll database (#has) for entry that exists returns true", function () {
            const actual = this.dbi.has("who@where.com", "2020-01-02");
            assert.ok(actual);
        });

        it("Poll database (#has) for entry that doesn't exist returns false", function () {
            const actual = this.dbi.has("nope", "2020-01-02");
            assert.ok(!actual);
        });

        describe(`Update an entry's status`, function () {
            before(function () {
                this.dbi = new DBInterface().open();
                this.dbi.update(this.hash, "accepted");
            });
    
            it("#get returns an object with status 'accepted'", function () {
                const actual = this.dbi.get(this.hash).status;
                const expected = "accepted";
                assert.strictEqual(actual, expected);
            });
        });        
    });

    describe(`Roles`, function () {
        before(function () {
            this.dbi = new DBInterface().open();
        });

        it("adds the role", function () {
            const actual = this.dbi.addRole("manager", "manager@somewhere.com").changes;
            const expected = 1;
            assert.strictEqual(actual, expected);
        });

        it("retrieves correct role", function () {
            const actual = this.dbi.lookupRole("manager").email;
            const expected = "manager@somewhere.com";
            assert.strictEqual(actual, expected);
        });
    });
});
