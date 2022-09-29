import CONST from "../constants.js";
import {managerData, staffPending} from "../helpers/buildData.js";

async function submitNew(data, dbi, emi) {
    // store pending request in DB
    const hash = dbi.addRequest(data);

    // email managers
    const subjectMgr = `Vacation Request From ${data.name}`;
    const managers = [];

    for (const row of dbi.getAllRoles(CONST.ROLES.MANAGER)) {
        const mData = managerData(data, row.email, hash);
        console.log(row.email);
        await emi.sendFile(row.email, "", CONST.RESPONSE.NOTIFY_MANAGER, subjectMgr, mData);
        managers.push(row.email);
    }

    // email the staff member
    const sData = staffPending(data, managers);    
    const subectStaff = "Vacation Request Confirmation";
    await emi.sendFile(data.email, "", CONST.RESPONSE.NOTIFY_STAFF, subectStaff, sData);

    return { ...sData, hash: hash };
}

export default submitNew;