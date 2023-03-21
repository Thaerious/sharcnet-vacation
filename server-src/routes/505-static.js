import express from "express";

const router = express.Router();

router.use(express.static(`www/static`));
router.use(express.static(`www/compiled`));

export default router;