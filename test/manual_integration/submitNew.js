import submitNew from "../../server-src/functionality/submitNew.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("test.db").open();
const emi = new EMInterface();

const data = {
    email: "frar.test@gmail.com",    
    start_date : "2022-07-11",
    end_date : "2022-07-11", 
    type : "full", 
    name : "Steve McQueen",
    institution : "guelph"
}

const resultDate = await submitNew(data, dbi, emi)

console.log(resultDate);
