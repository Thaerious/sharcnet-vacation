import Express from "express";
import constants from "../constants.js";
import DBInterface from "../DBInterface.js";
import EMInterface from "../EMInterface.js";

function acceptRoute(wmw){
    const route =  Express.Router();
    const dbi = new DBInterface().open();
    const emi = new EMInterface(process.env.EMAIL_USER, process.env.EMAIL_PASSWD);

    route.use(constants.loc.endpoint.ACCEPT, async (req, res, next) => {    
        dbi.update(req.query.hash, constants.status.REJECTED);
        res.redirect(constants.loc.endpoint.ACCEPTED + "?hash=" + req.query.hash);
    });

    route.use(constants.loc.endpoint.ACCEPTED, async (req, res, next) => {    
        const data = dbi.get(req.query.hash);

        try{
            const r = await wmw.render(constants.loc.endpoint.ACCEPTED, data, res, next);
        } catch (err) {
            console.log(err);
        }
    });

    return route;
}

export default acceptRoute;

