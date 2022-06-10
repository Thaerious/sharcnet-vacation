import FS from "fs";
import constants from "./constants.js"

export default function reject500(req, res) {
    const html = FS.readFileSync(constants.loc.html.SERVER_ERROR_500, "utf-8");
    res.send(html);
    res.end();
}