import Express from "express";

const router =  Express.Router();

const data = {
    CLIENT_ID: process.env.CLIENT_ID
};

router.use(`/app`, 
    (req, res, next) => {
        res.render(
            "vacation-app/index/index.ejs",
            data,
            responseHandler
        );
    }
);

router.use(`/google`, 
    (req, res, next) => {
        res.render(
            "google/index.ejs",
            data, 
            responseHandler
        );
    }
);

function responseHandler(err, html) {
    if (err) {
        throw new Error(err);
    } else{
        res.send(html);
    }
}

export default router;