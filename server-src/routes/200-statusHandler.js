import dotenv from "dotenv";
import Express from "express";
import reject500 from "../reject500.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import { WidgetMiddleware } from "@html-widget/core";
import CONST from "../constants.js";
import {statusData} from "../helpers/buildData.js";

dotenv.config();

const statusRoute =  Express.Router();
const dbi = new DBInterface().open();
const mwm = new WidgetMiddleware();

statusRoute.use(`/status`, async (req, res, next) => {    
    try {
        const data = statusData(dbi.get(req.query.hash));
        data.inst_email = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)[0].email;
        await mwm.render("status", data, res, next);
    } catch (error){
        logger.error(error.toString());
        console.error(error);
        reject500(req, res);
    }
});

export default statusRoute;

