import {loadTemplate} from "@thaerious/utility";
import CONST from "../constants.js"

export default function accept200(req, res, body = {}) {
    const json = JSON.stringify(body);
    res.status(200);
    res.send(json);
    res.end();
}