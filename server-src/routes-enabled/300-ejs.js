import Express from "express";
import CONST from "../constants.js";

const router = Express.Router();

const data = {
    CLIENT_ID: process.env.CLIENT_ID
};

router.use(`/app`,
    (req, res, next) => {
        console.log(req.session);
        res.render(
            "vacation-app/index/index.ejs",
            {...data, EMAIL : req.session[CONST.SESSION.EMAIL]},
            responseHandler(res)
        );
    }
);

router.use(`/google`,
    (req, res, next) => {
        res.render(
            "google/index.ejs",
            data,
            responseHandler(res)
        );
    }
);

function responseHandler(res) {
    return (err, html) => {
        if (err) {
            throw new Error(err);
        } else {
            res.send(html);
        }
    }
}

export default router;