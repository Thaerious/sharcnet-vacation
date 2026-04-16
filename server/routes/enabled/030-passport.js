import Express from "express";
import passport from "passport";

const router = Express.Router();

router.use(passport.initialize());
router.use(passport.session());

export default router;