import { loadTemplate } from "@thaerious/utility";
import nodemailer from "nodemailer";
import logger from "./setupLogger.js";
import throwIfNot from "./helpers/throwIfNot.js";

/**
 * Email Interface
 */
class EMInterface {
    async send(email, cc, subject, html, text, id) {
        throwIfNot(email, cc, subject, html, text, id);

        const creds = {
            host: process.env.EMAIL_HOST,
            secure: false,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWD,
            },
        };

        const transporter = nodemailer.createTransport(creds);

        // send mail with defined transport object
        await transporter.sendMail({
            from: `"SHARCNET Vacation Mailer" <${process.env.EMAIL_FROM}>`,
            to: email,        // list of receivers
            cc: cc,
            subject: subject, // Subject line
            text: text,       // plain text body
            html: html,       // html body
            headers: {
                'X-SNVAC-ID': id
            }
        });
    }
}

export default EMInterface;