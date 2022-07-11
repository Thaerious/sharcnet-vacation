import Path from "path";
import dotenv from "dotenv";

dotenv.config();

const loc = {
    "SERVER_ASSETS" : "server-assets",        
};

loc.endpoint = {
    "ACCEPTED" : "/accepted",
    "REJECTED" : "/rejected",
    "ACCEPT" : "/accept",
    "REJECT" : "/reject",
    "SUBMIT" : "/submit"
}

loc.html = {
    "BAD_REQUEST_400" : Path.join(loc.SERVER_ASSETS, "400_bad_request.html"),
    "SERVER_ERROR_500" : Path.join(loc.SERVER_ASSETS, "500_server_error.html"),
    "ACCEPT_URL" : process.env.SERVER_NAME + loc.endpoint.ACCEPT,
    "REJECT_URL" : process.env.SERVER_NAME + loc.endpoint.REJECT,    
}

const response = {
    "NOTIFY_MANAGER" : "server-assets/response_emails/notify_manager.html",
    "NOTIFY_STAFF" : "server-assets/response_emails/notify_staff.html",
    "NOTIFY_ADMIN" : "server-assets/response_emails/notify_admin.html"
}

const status = {
    PENDING : "pending",
    REJECTED : "rejected",
    ACCEPTED : "accepted"
}

export default {
    loc : loc,
    status : status,
    response, response
};