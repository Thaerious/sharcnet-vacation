import dotenv from "dotenv";
import Express from "express";
import reject400 from "../reject400.js"
import reject500 from "../reject400.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";
import rejectRequest from "../functionality/rejectRequest.js";

dotenv.config();

const rejectRoute =  Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

rejectRoute.use(`/reject`, async (req, res, next) => {    
    try {
        rejectRequest(req.query.hash, dbi, emi, req.body);
        res.redirect("/rejected");
    } catch (error){
        logger.error(error.toString());
        reject500(req, res);
    }
});

export default rejectRoute;

