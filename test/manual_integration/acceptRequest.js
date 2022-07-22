import acceptRequest from "../../server-src/functionality/acceptRequest.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("test.db").open();
const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD, process.env.EMAIL_PORT, process.env.EMAIL_HOST);

const hash = process.argv[2];
await acceptRequest(hash, dbi, emi);
