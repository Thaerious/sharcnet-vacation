import Path from "path";
import dotenv from "dotenv";
import args from "./parseArgs.js";

dotenv.config();

const LOC = {
    "SERVER_ASSETS" : "server-assets",   
    "ROUTES" : "server-src/routes-enabled",    
};

LOC.ENDPOINT = {
    "ACCEPTED"  : "/accepted",
    "REJECTED"  : "/rejected",
    "ACCEPT"    : "/accept",
    "REJECT"    : "/reject",
    "SUBMITTED" : "/submitted",
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
    ACCEPTED : "accepted",
}

const ROLES = {
    MANAGER : "manager",
    ADMIN : "admin",
}

const SERVER = {
    SSL_KEY: `${process.env.SSL_KEY || './keys/key.pem'}`,
    SSL_CERT: `${process.env.SSL_CERT || './keys/cert.pem'}`,
    PORT: `${args.port || process.env.PORT || 80}`,
    SSLPORT : `${args.sslport || process.env.SSLPORT || 433}`,
}

const GOOGLE = {
    CLIENT_ID: `${process.env.CLIENT_ID}`,
    GOOGLE_URL: 'https://accounts.google.com',
    DISCOVERY_URL: 'https://accounts.google.com/.well-known/openid-configuration'    
}

const SESSION = {
    LOGGED_IN: `LOGGED_IN`,
    USER_EMAIL: `USER_EMAIL`
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