import express from "express";

const router = express.Router();

router.use("/", express.static("www"));
router.use("/", express.static("www/css"));
router.use("/", express.static("www/assets"));

export default router;