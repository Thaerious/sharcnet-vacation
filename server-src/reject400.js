import {loadTemplate} from "@thaerious/utility";
import constants from "./constants.js"

export default function reject400(req, res, message) {
    const html = loadTemplate(constants.loc.html.BAD_REQUEST_400, {
        message: message,
        body: JSON.stringify(req.body, null, 2),
    });
    res.send(html);
    res.end();
}