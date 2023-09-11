import CONST from "../constants.js";
import { loadTemplate } from "@thaerious/utility";

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
async function rejectRequest(hash, managerEmail, dbi, emi) {
    let data = expandDatesInData(dbi.getRequest(hash));

    if (data.status !== CONST.STATUS.PENDING) {
        return {
            success: false,
            message: "Request status: ${data.status}"
        }
    }

    dbi.update(hash, CONST.STATUS.REJECTED);

    const subject = "Vacation Request Update: Rejected.";
    const html = loadTemplate(CONST.EMAIL_TEMPLATE.STAFF_REJECTED.HTML, data);
    const text = loadTemplate(CONST.EMAIL_TEMPLATE.STAFF_REJECTED.TXT, data);   
    emi.send(data.email, "", subject, html, text);
}

export default rejectRequest;