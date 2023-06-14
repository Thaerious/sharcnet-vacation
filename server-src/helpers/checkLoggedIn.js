import CONST from "../constants.js";

export default function checkLoggedIn(req, res, next) {
    if (req.session[CONST?.SESSION?.LOGGED_IN] != true) {
        res.redirect("/google");
    }
    else {
        next();
    }
}