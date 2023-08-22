import Path from "path";
import dotenv from "dotenv";
import args from "./parseArgs.js";

dotenv.config();

const LOC = {
    "ROUTES" : "server-src/routes-enabled",    
};

LOC.HTML = {
    "BAD_REQUEST_400" : Path.join("server-assets", "400_bad_request.html"),
    "SERVER_ERROR_500" : Path.join("server-assets", "500_server_error.html"),
    "ACCEPT_URL" : process.env.SERVER_NAME + "/accept",
    "REJECT_URL" : process.env.SERVER_NAME + "/reject",    
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
    ACCEPTED : "accepted",
}

const ROLES = {
    MANAGER : "manager",
    ADMIN: "admin",
    USER: "user"
}

const SERVER = {
    SSL_KEY: `${process.env.SSL_KEY || './keys/key.pem'}`,
    SSL_CERT: `${process.env.SSL_CERT || './keys/cert.pem'}`,
    PORT : `${args.sslport || process.env.SSL_PORT || 443}`,
}

const GOOGLE = {
    CLIENT_ID: `${process.env.CLIENT_ID}`
}

const SESSION = {
    LOGGED_IN: `LOGGED_IN`,
    EMAIL: `USER_EMAIL`
}

export default {
    ROLES    : ROLES,
    LOC      : LOC,
    STATUS   : STATUS,
    RESPONSE : RESPONSE,
    SERVER: SERVER,
    GOOGLE: GOOGLE,
    SESSION: SESSION
};