import Path from "path";
import Express from "express";

const route = Express.Router();

route.get("/index", (req, res, next) => {
    const path = Path.join("index", "index");
    res.render(path, {}, (err, html) => {
        if (err) {
            console.error(err);
            res.status(500);
            res.send("500 Server Error");
        } else res.send(html);
    });
});

export default route;
