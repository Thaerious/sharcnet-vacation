import {loadTemplate} from "@thaerious/utility";
import CONST from "./constants.js"

export default function reject400(req, res, message) {
    const html = loadTemplate(CONST.LOC.HTML.BAD_REQUEST_400, {
        message: message,
        body: JSON.stringify(req.body, null, 2),
    });
    res.send(html);
    res.end();
}