import dotenv from "dotenv";
import Express from "express";
import reject500 from "../responses/reject500.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";
import rejectRequest from "../functionality/rejectRequest.js";

dotenv.config();

const rejectRoute =  Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface();

rejectRoute.use(`/reject`, async (req, res, next) => {
    try {
        rejectRequest(req.query.hash, req.query.email, dbi, emi, req.body);
        logger.log('/reject');
        logger.log(dbi.getRequestByHash(req.query.hash));
        res.redirect(`/status?hash=${req.query.hash}`);
        logger.log(JSON.stringify({ ...req.query, action: "reject" }));
    } catch (error){
        logger.error(error.toString());
        console.error(error);
        reject500(req, res);
    }
});

rejectRoute.on = async (action) => {
    switch (action) {
        case "close":
            dbi.close();
            await emi.wait();
            break;
    }
}

export {rejectRoute as default}

