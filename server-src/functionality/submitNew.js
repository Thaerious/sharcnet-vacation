import CONST from "../constants.js";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

async function submitNew(data, dbi, emi) {
    // store pending request in DB
    const hash = dbi.addRequest(data);

    const acceptUrl = new URL(CONST.LOC.HTML.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);

    const rejectURL = new URL(CONST.LOC.HTML.REJECT_URL);
    rejectURL.searchParams.append("hash", hash);

    data.start_date += "T00:00:00";
    data.end_date += "T00:00:00";

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const returnDate = nextWeekday(endDate);
    const opt = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }

    const rData = {
        ...data,
        weekday_count: countWeekdays(startDate, endDate),
        return_date: returnDate.toLocaleDateString("en-CA", opt),
        start_date: startDate.toLocaleDateString("en-CA", opt),
        end_date: endDate.toLocaleDateString("en-CA", opt),
    }

    const mData = {
        ...rData,
        ACCEPTED_URL: acceptUrl,
        REJECTED_URL: rejectURL,
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
        ...rData,
        todays_date: new Date().toLocaleDateString("en-CA", opt),
        manager_email: managers.toString(),
        status: CONST.STATUS.PENDING,
    }

    if (sData.duration == "full") sData.duration = "full day";
    const subectStaff = "Vacation Request Verfication Notice";
    await emi.sendFile(data.email, "", CONST.RESPONSE.NOTIFY_STAFF, subectStaff, sData);

    return { ...sData, hash: hash };
}

export default submitNew;