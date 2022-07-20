import dotenv from "dotenv";
import Express from "express";
import reject500 from "../reject500.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";
import { WidgetMiddleware } from "@html-widget/core";

dotenv.config();

const rejectedRoute =  Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);
const mwm = new WidgetMiddleware();

rejectedRoute.use(`/rejected`, async (req, res, next) => {    
    try {
        const data = dbi.get(req.query.hash);
        data.inst_email = dbi.lookupRole(data.institution).email;
        await mwm.render("rejected", res, next, data);
    } catch (error){
        logger.error(error.toString());
        reject500(req, res);
    }
});

export default rejectedRoute;
