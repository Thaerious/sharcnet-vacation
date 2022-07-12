import dotenv from "dotenv";
import Express from "express";
import reject500 from "../reject500.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";
import acceptRequest from "../functionality/acceptRequest.js";

dotenv.config();

const acceptRoute =  Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

acceptRoute.use(`/accept`, async (req, res, next) => {    
    try {
        acceptRequest(req.query.hash, dbi, emi, req.body);
        res.redirect("/accepted");
    } catch (error){
        logger.error(error.toString());
        reject500(req, res);
    }
});

export default acceptRoute;

