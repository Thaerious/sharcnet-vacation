import submitNew from "../../server-src/functionality/submitNew.js";
import DBInterface from "../../server-src/DBInterface.js";
import EMInterface from "../../server-src/EMInterface.js";

const dbi = new DBInterface("production.db").open();
const emi = new EMInterface();

const data = {
    email: "frar.test@gmail.com",    
    start_date : "2022-10-10",
    end_date : "2022-10-20", 
    type : "full", 
    name : "Steve McQueen",
    institution : "guelph"
}

const resultDate = await submitNew(data, dbi, emi)

console.log(resultDate);
