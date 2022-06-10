import dotenv from "dotenv";
import Express from "express";
import reject400 from "../reject400.js"
import reject500 from "../reject400.js"
import constants from "../constants.js";
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";

dotenv.config();

const rejectRoute =  Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

rejectRoute.use(`/reject`, async (req, res, next) => {
    
    try {
        // update db entry
        const hash = dbi.update(req.query.hash, constants.status.REJECTED);
        const email = dbi.get(req.query.hash).email;
        if (!hash) reject400(req, res, "unkown hash");

        // email staff member
        const subject = "Vacation Request Web-App Automated Notification";
        emi.sendFile(email, "server-assets/reject_staff.html", subject, req.body);
        
        res.redirect("/rejected");
    } catch (error){
        logger.error(error.toString());
        reject500(req, res);
    }
});



export default rejectRoute;

