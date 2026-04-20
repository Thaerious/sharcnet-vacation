const emailTemplate = (name) => ({
    HTML: `server/assets/${name}.html`,
    TXT:  `server/assets/${name}.txt`,
});

export default {
    STATUS:    { PENDING: "pending", REJECTED: "rejected", ACCEPTED: "accepted" },
    ROLES:     { MANAGER: "manager", ADMIN: "admin", USER: "user" },
    SESSION:   { LOGGED_IN: "LOGGED_IN", EMAIL: "USER_EMAIL" },
    ENDPOINTS: { GOOGLE: "/google" },
    PATH:      { ACCEPT: "/accept", REJECT: "/reject" },
    LOC: {
        RESPONSE_TEMPLATES: "assets/response_templates",
        WWW: "www/",
    },
    ASSETS: {
        NOTIFY_MANAGER:  emailTemplate("notify_manager"),
        NOTIFY_STAFF:    emailTemplate("notify_staff"),
        NOTIFY_ADMIN:    emailTemplate("notify_admin"),
        STAFF_ACCEPTED:  emailTemplate("notify_staff_accepted"),
        STAFF_REJECTED:  emailTemplate("notify_staff_rejected"),
    },
};