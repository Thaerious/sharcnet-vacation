import constants from "../constants.js";

async function submitNew(data, dbi, emi){
    // store pending request in DB
    const hash = dbi.add(data);

    // email the manager
    const acceptUrl = new URL(constants.loc.html.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);
    const rejectURL = new URL(constants.loc.html.REJECT_URL);
    rejectURL.searchParams.append("hash",hash);

    const mData = {
        ACCEPTED_URL : acceptUrl,
        REJECTED_URL : rejectURL,
        ...data
    }

    const subjectMgr = `Vacation Request From ${data.name}`;
    await emi.sendFile(dbi.lookupRole("manager").email, constants.response.NOTIFY_MANAGER, subjectMgr, mData);

    // email the staff member
    const sData = {
        todays_date : new Date().toString(),
        manager_email : dbi.lookupRole("manager").email,
        status : constants.status.PENDING,
        ...data
    }
    if (sData.duration == "full") sData.duration = "full day";
    const subectStaff = "Vacation Request Verfication Notice";
    await emi.sendFile(data.email, constants.response.NOTIFY_STAFF, subectStaff, sData);
    return hash;
}

export default submitNew;