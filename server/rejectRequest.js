import CONST from "./constants.js";
import loadAsset from "./loadAsset.js";
import { expandDatesInRecord, humanizeDates } from "./buildData.js";
import dbi from "./DBInterface.js"
import { sendEmail } from "./email_interface.js";

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
async function rejectRequest(hash) {
    const raw = dbi.getRequestByHash(hash);
    
    if (!raw || raw.status !== CONST.STATUS.PENDING) {
        return {
            success: false,
            message: `Invalid or missing request.`
        }        
    }

    var dbRec = expandDatesInRecord(raw);

    dbi.updateStatusByHash(hash, CONST.STATUS.REJECTED);

    const subject = "Vacation Request Update: Rejected.";
    const html = loadAsset(CONST.ASSETS.STAFF_REJECTED.HTML, dbRec);
    const text = loadAsset(CONST.ASSETS.STAFF_REJECTED.TXT, dbRec);
    dbRec = humanizeDates(dbRec);
    sendEmail(dbRec.email, "", subject, html, text, dbRec.id);
}

export default rejectRequest;