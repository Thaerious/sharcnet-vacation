import CONST from "../constants.js";
import { countWeekdays, nextWeekday } from "../helpers/weekdays.js";

async function submitNew(data, dbi, emi) {
    // store pending request in DB
    const hash = dbi.addRequest(data);

    const acceptUrl = new URL(CONST.LOC.HTML.ACCEPT_URL);
    acceptUrl.searchParams.append("hash", hash);

    const rejectURL = new URL(CONST.LOC.HTML.REJECT_URL);
    rejectURL.searchParams.append("hash", hash);

    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    const returnDate = nextWeekday(endDate);
    const opt = {weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'}

    const mData = {
        ...data,
        ACCEPTED_URL: acceptUrl,
        REJECTED_URL: rejectURL,
        weekday_count: countWeekdays(startDate, endDate),
        return_date: returnDate.toLocaleDateString("en-CA", opt),
        start_date: startDate.toLocaleDateString("en-CA", opt),
        end_date: endDate.toLocaleDateString("en-CA", opt),
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
        weekday_count: countWeekdays(data.from_date, data.to_date),
        ...data
    }

    if (sData.duration == "full") sData.duration = "full day";
    const subectStaff = "Vacation Request Verfication Notice";
    await emi.sendFile(data.email, "", CONST.RESPONSE.NOTIFY_STAFF, subectStaff, sData);

    return {...mData, hash: hash};
}

export default submitNew;