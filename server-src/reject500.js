import FS from "fs";
import CONST from "./constants.js"

export default function reject500(req, res) {
    const html = FS.readFileSync(CONST.LOC.HTML.SERVER_ERROR_500, "utf-8");
    res.send(html);
    res.end();
}