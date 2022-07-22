import rejectRequest from "../../server-src/functionality/rejectRequest.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("test.db").open();
const emi = new EMInterface();

const hash = process.argv[2];
await rejectRequest(hash, dbi, emi);

