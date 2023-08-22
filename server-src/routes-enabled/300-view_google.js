import Express from "express";
import viewResponseHandler from "../helpers/viewResponseHandler.js";

const router = Express.Router();

const data = {
    client_id: process.env.CLIENT_ID
};

console.log(data);

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