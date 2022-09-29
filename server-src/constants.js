import Path from "path";
import dotenv from "dotenv";

dotenv.config();

const LOC = {
    "SERVER_ASSETS" : "server-assets",        
};

LOC.ENDPOINT = {
    "ACCEPTED"  : "/accepted",
    "REJECTED"  : "/rejected",
    "ACCEPT"    : "/accept",
    "REJECT"    : "/reject",
    "SUBMITTED" : "/submitted"
}

LOC.HTML = {
    "BAD_REQUEST_400" : Path.join(LOC.SERVER_ASSETS, "400_bad_request.html"),
    "SERVER_ERROR_500" : Path.join(LOC.SERVER_ASSETS, "500_server_error.html"),
    "ACCEPT_URL" : process.env.SERVER_NAME + LOC.ENDPOINT.ACCEPT,
    "REJECT_URL" : process.env.SERVER_NAME + LOC.ENDPOINT.REJECT,    
}

const RESPONSE = {
    "NOTIFY_MANAGER" : "assets/email_templates/notify_manager.html",
    "NOTIFY_STAFF" : "assets/email_templates/notify_staff.html",
    "NOTIFY_ADMIN" : "assets/email_templates/notify_admin.html",
    "STAFF_ACCEPTED" : "assets/email_templates/notify_staff_accepted.html"
}

const STATUS = {
    PENDING : "pending",
    REJECTED : "rejected",
    ACCEPTED : "accepted"
}

const ROLES = {
    MANAGER : "manager",
    ADMIN : "admin"
}

export default {
    ROLES    : ROLES,
    LOC      : LOC,
    STATUS   : STATUS,
    RESPONSE : RESPONSE
};