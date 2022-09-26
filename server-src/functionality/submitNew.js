import CONST from "../constants.js";

async function submitNew(data, dbi, emi) {
    // store pending request in DB
    const hash = dbi.addRequest(data);

    // email the manager
    const acceptUrl = new URL(CONST.LOC.HTML.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);
    
    const rejectURL = new URL(CONST.LOC.HTML.REJECT_URL);
    rejectURL.searchParams.append("hash", hash);

    const mData = {
        ACCEPTED_URL: acceptUrl,
        REJECTED_URL: rejectURL,
        ...data
    }

    // email managers
    const subjectMgr = `Vacation Request From ${data.name}`;
    const managers = [];

    
    for (const row of dbi.getAllRoles(CONST.ROLES.MANAGER)) {
        await emi.sendFile(row.email, "", CONST.RESPONSE.NOTIFY_MANAGER, subjectMgr, mData);
        managers.push(row.email);
    }

    // email the staff member
    const sData = {
        todays_date: new Date().toString(),
        manager_email: managers.toString(),
        status: CONST.STATUS.PENDING,
        ...data
    }
    
    if (sData.duration == "full") sData.duration = "full day";
    const subectStaff = "Vacation Request Verfication Notice";
    await emi.sendFile(data.email, "", CONST.RESPONSE.NOTIFY_STAFF, subectStaff, sData);
    return hash;
}

export default submitNew;