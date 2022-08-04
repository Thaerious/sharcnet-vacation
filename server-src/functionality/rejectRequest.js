import constants from "../constants.js";

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
 async function rejectRequest(hash, dbi, emi){
    dbi.update(hash, constants.status.REJECTED);

    const data = {
        todays_date : new Date().toString(),
        manager_email : dbi.lookupRole("manager").email,
        status : constants.status.REJECTED,
        ...dbi.get(hash)
    }

    const subject = "Vacation Request Update: Rejected.";
    emi.sendFile(data.email, "", constants.response.NOTIFY_STAFF, subject, data);    
}

export default rejectRequest;