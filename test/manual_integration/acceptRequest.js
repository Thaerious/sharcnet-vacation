import acceptRequest from "../../server-src/functionality/acceptRequest.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("production.db").open();
const emi = new EMInterface();

const hash = process.argv[2];
const email = process.argv[3];
await acceptRequest(hash, email, dbi, emi);
