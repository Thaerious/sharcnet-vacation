import CONST from "../constants.js";
import {statusData} from "../helpers/buildData.js";

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
 async function rejectRequest(hash, managerEmail, dbi, emi){
    let data = statusData(dbi.get(hash), managerEmail);
    if (data.status !== CONST.STATUS.PENDING){
        return {
            success : false,
            message : "Request status: ${data.status}"
        }
    }

    dbi.update(hash, CONST.STATUS.REJECTED);    

    const subject = "Vacation Request Update: Rejected.";
    emi.sendFile(data.email, "", CONST.RESPONSE.NOTIFY_STAFF, subject, data);    
}

export default rejectRequest;