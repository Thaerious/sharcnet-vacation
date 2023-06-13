import Express from "express";
import DBInterface from "../DBInterface.js";
import viewResponseHandler from "../helpers/viewResponseHandler.js";

const router = Express.Router();
const dbi = new DBInterface().open();

const data = {
    client_id: process.env.CLIENT_ID
};

router.use(`/google`,
    (req, res, next) => {
        const data = {
            client_id: process.env.CLIENT_ID
        };

        res.render(
            "google/index.ejs",
            data,
            viewResponseHandler(res)
        );
    }
);

export default router;