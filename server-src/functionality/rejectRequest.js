import constants from "../constants.js";

/**
 * hash : stored db index hash for the request
 * data : from request body (as json) see doc/vacation_accept.pdf (1)
 */
 async function rejectRequest(data, dbi, emi){
    dbi.update(data.hash, constants.status.REJECTED);

    data = {
        todays_date : new Date().toString(),
        manager_email : dbi.lookupRole("manager").email,
        status : constants.status.REJECTED,
        ...data
    }       

    const subject = "Vacation Request Update: Rejected.";
    emi.sendFile(data.email, constants.response.NOTIFY_STAFF, subject, data);    
}

export default rejectRequest;