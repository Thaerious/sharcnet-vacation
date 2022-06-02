import Path from "path";
import Express from "express";

const route = Express.Router();

route.get(`/index`, (req, res, next) => {
    console.log("Index View");
    const path = Path.join(`index`, `index`);
    res.render(path, {}, (err, html) => {
        if (err) {
            console.error("An error has occured");
            res.status(500);
            res.send(`500 Server Error`);
            process.exit();
        } else res.send(html);
    });
});

export default route;
