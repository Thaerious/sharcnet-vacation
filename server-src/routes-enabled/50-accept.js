import dotenv from "dotenv";
import Express from "express";
import reject500 from "../responses/reject500.js"
import DBInterface from "../DBInterface.js";
import logger from "../setupLogger.js";
import EMInterface from "../EMInterface.js";
import acceptRequest from "../functionality/acceptRequest.js";

dotenv.config();

const acceptRoute = Express.Router();
const dbi = new DBInterface().open();
const emi = new EMInterface();

acceptRoute.use(`/accept`, async (req, res, next) => {
    try {
        acceptRequest(req.query.hash, req.query.email, dbi, emi);
        res.redirect(`/status?hash=${req.query.hash}`);
    } catch (error) {
        logger.error(error.toString());
        reject500(req, res);
    }
});

acceptRoute.on = async (action) => {
    switch (action) {
        case "close":
            dbi.close();
            await emi.wait();
            break;
    }
}

export {acceptRoute as default}

