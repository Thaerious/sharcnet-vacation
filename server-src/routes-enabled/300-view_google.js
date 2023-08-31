import Express from "express";
import catchRenderingError from "../helpers/catchRenderingError.js";

const router = Express.Router();

router.use(`/google`,
    (req, res, next) => {
        const data = {
            client_id: process.env.CLIENT_ID
        };

        res.render(
            "google/index.ejs",
            data,
            catchRenderingError(res)
        );
    }
);

export default router;