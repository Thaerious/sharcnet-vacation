import CONST from "./constants.js";
import loadAsset from "./loadAsset.js";
import { expandDatesInRecord, humanizeDates } from "./buildData.js";
import dbi from "./DBInterface.js"

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
async function rejectRequest(hash) {
    let dbRec = expandDatesInRecord(dbi.getRequestByHash(hash));

    if (dbRec.status !== CONST.STATUS.PENDING) {
        return {
            success: false,
            message: "Request status: ${data.status}"
        }
    }

    dbi.updateStatusByHash(hash, CONST.STATUS.REJECTED);

    const subject = "Vacation Request Update: Rejected.";
    const html = loadAsset(CONST.ASSETS.STAFF_REJECTED.HTML, dbRec);
    const text = loadAsset(CONST.ASSETS.STAFF_REJECTED.TXT, dbRec);
    dbRec = humanizeDates(dbRec);
    sendMail(dbRec.email, "", subject, html, text, dbRec.id);
}

export default rejectRequest;