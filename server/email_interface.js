// email_interface.js

import nodemailer from "nodemailer";
import logger from "./setupLogger.js";
import throwIfNot from "./throwIfNot.js";
import chalk from "chalk";

// const log = (...args) => logger.debug(...args);
const log = () => {};

let pending = [];

export function sendEmail(recipient_email, cc, subject, html, text, id) {
    log(chalk.blue(`EMI.send ${recipient_email} | subject="${subject}" | id=${id}`));

    // Blow up early if any required argument is missing
    throwIfNot({ recipient_email, cc, subject, html, text, id });

    // SMTP credentials pulled from environment variables
    const creds = {
        host: process.env.EMAIL_HOST,
        secure: false,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWD,
        },
    };

    log(chalk.blue(`EMI.send SMTP host=${creds.host} port=${creds.port} user=${creds.auth.user}`));

    const transporter = nodemailer.createTransport(creds);

    // Kick off the send — this returns a promise immediately without blocking
    const mailPromise = transporter.sendMail({
        from: `"SHARCNET Vacation Mailer" <${process.env.EMAIL_FROM}>`,
        to: recipient_email,
        cc: cc,
        subject: subject,
        text: text,
        html: html,
        headers: {
            // Attach our internal ID so sent emails can be traced back to a request
            'x-snvac-id': id
        }
    });

    log(chalk.blue(`EMI.send enqueued | pending=${pending.length + 1} | id=${id}`));
    pending.push(mailPromise);

    mailPromise
        .then((info) => {
            log(chalk.green(`EMI.send success | id=${id} | messageId=${info.messageId} | accepted=${info.accepted}`));
        })
        .catch((err) => {
            log(chalk.red(`EMI.send failed | id=${id} | error=${err.message}`));
        })
        .finally(() => {
            const index = pending.indexOf(mailPromise);
            if (index !== -1) pending.splice(index, 1);
            log(chalk.blue(`EMI.send settled | id=${id} | pending=${pending.length}`));
        });
}

export async function waitForEmails() {
    log(chalk.blue(`EMI.wait called | pending=${pending.length}`));
    const snapshot = pending;
    pending = [];
    const results = await Promise.allSettled(snapshot);
    const fulfilled = results.filter(r => r.status === "fulfilled").length;
    const rejected  = results.filter(r => r.status === "rejected").length;
    log(chalk.blue(`EMI.wait done | fulfilled=${fulfilled} | rejected=${rejected}`));
}