import Express from "express";

const router =  Express.Router();
const viewpath = "vacation-app/index/index.ejs";
const data = {};

router.use(    
    `[/]`, 
    render   
);

router.use(    
    `/index`, 
    render   
);

async function render(req, res, next){
    res.render(viewpath, data, (err, html) => {
        if (err) {
            throw new Error(err);
        } else{
            res.send(html);
        }
    });    
}

export default router;