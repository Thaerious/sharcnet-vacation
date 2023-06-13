import Express from "express";
import DBInterface from "../DBInterface.js";
import dotenv from "dotenv";
import {statusData} from "../helpers/buildData.js";
import CONST from "../constants.js";

dotenv.config();

const statusRoute =  Express.Router();
const dbi = new DBInterface().open();
const router =  Express.Router();
const viewpath = "vacation-app/status/status.ejs";
const data = {};

router.use(    
    `/status`, 
    render   
);

async function render(req, res, next) {
    const data = statusData(dbi.getRequest(req.query.hash));
    data.inst_email = dbi.getAllRoles(CONST.ROLES.ADMIN, data.institution)[0].email;

    res.render(viewpath, data, (err, html) => {
        if (err) {
            throw new Error(err);
        } else{
            res.send(html);
        }
    });    
}

export default router;