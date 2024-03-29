import dotenv from "dotenv";

dotenv.config();

export default {
    LOC: {
        "ROUTES": "server-src/routes-enabled",
        "HTML": {
            "BAD_REQUEST_400": "server-assets/400_bad_request.html",
            "SERVER_ERROR_500": "server-assets/500_server_error.html",
            "ACCEPT_PATH": "/accept",
            "REJECT_PATH": "/reject",
        },
        "LOGFILE": "logs/log.txt",
        "ENDPOINTS": {
            "GOOGLE": "/google"
        }
    },
    EMAIL_TEMPLATE: {
        NOTIFY_MANAGER: {
            HTML: "assets/email_templates/notify_manager.html",
            TXT : "assets/email_templates/notify_manager.txt",
        },
        NOTIFY_STAFF: {
            HTML: "assets/email_templates/notify_staff.html",
            TXT : "assets/email_templates/notify_staff.txt",
        },
        NOTIFY_ADMIN: {
            HTML: "assets/email_templates/notify_admin.html",
            TXT : "assets/email_templates/notify_admin.txt",
        },
        STAFF_ACCEPTED: {
            HTML: "assets/email_templates/notify_staff_accepted.html",
            TXT : "assets/email_templates/notify_staff_accepted.txt",
        },
        STAFF_REJECTED: {
            HTML: "assets/email_templates/notify_staff_rejected.html",
            TXT : "assets/email_templates/notify_staff_rejected.txt",
        }
    },
    STATUS: {
        PENDING: "pending",
        REJECTED: "rejected",
        ACCEPTED: "accepted",
    },
    ROLES: {
        MANAGER: "manager",
        ADMIN: "admin",
        USER: "user"
    },
    SERVER: {
        SSL_KEY: "./keys/key.pem",
        SSL_CERT: './keys/cert.pem'
    },
    SESSION: {
        LOGGED_IN: `LOGGED_IN`,
        EMAIL: `USER_EMAIL`
    },
    DB: {
        EMPTY_DB_PATH: `db/empty.db`
    }
};