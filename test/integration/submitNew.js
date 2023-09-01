// Create a new vacation request
// Copy the hash value to the accept or reject scripts

import submitNew from "../../server-src/functionality/submitNew.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";
import logger from "../../server-src/setupLogger.js";

const dbi = new DBInterface("production.db").open();
const emi = new EMInterface();

const data = {
    email: "frar.test@gmail.com",    
    start_date : "2022-11-15",
    end_date : "2022-11-16", 
    type : "full", 
    name : "Steve McQueen",
    institution : "guelph"
}

const r1 = await submitNew(data, dbi, emi)
logger.debug(r1);
