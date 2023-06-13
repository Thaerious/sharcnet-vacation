import CONST from "../constants.js";
import {managerData, staffPending} from "../helpers/buildData.js";

/**
 * Generate emails and update the database when a new vacation request is submitted.
 */
async function submitNew(data, dbi, emi) {
    // store pending request in DB
    const hash = dbi.addRequest(data);

    // email managers
    const subjectMgr = `SHARCNET Vacation Request: ${data.name}, ${data.start_date}`;
    const managers = [];

    for (const row of dbi.getAllRoles(CONST.ROLES.MANAGER)) {
        const mData = managerData(data, row.email, hash);
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