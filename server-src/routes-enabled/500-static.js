import Express from "express";

const router = Express.Router();

router.use(Express.static(`www/static`));
router.use(Express.static(`www/compiled`));

export default router;