import submitNew from "../../server-src/functionality/submitNew.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("test.db").open();
const emi = new EMInterface();

const data = {
    email: "frar.test@gmail.com",    
    start_date : "2022-07-11",
    end_date : "2022-07-16", 
    type : "full", 
    name : "Steve McQueen",
    institution : "guelph"
}

console.log(await submitNew(data, dbi, emi));
