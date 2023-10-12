import nodemailer from "nodemailer";
import logger from "./setupLogger.js";
import throwIfNot from "./helpers/throwIfNot.js";

/**
 * Email Interface
 */
class EMInterface {
    pending = [];

    async wait() {
        for (const promise of this.pending) {
            await promise;
        }
    }

    send(email, cc, subject, html, text, id) {
        logger.debug(`EMI.send ${email}`);
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
        const mailPromise = transporter.sendMail({
            from: `"SHARCNET Vacation Mailer" <${process.env.EMAIL_FROM}>`,
            to: email,        // list of receivers
            cc: cc,
            subject: subject, // Subject line
            text: text,       // plain text body
            html: html,       // html body
            headers: {
                'x-snvac-id': id
            }
        });
        mailPromise.name = "Mail Promise";

        mailPromise.then((resolve, reject) => {
            const index = this.pending.indexOf(mailPromise);
            this.pending.splice(index, 1);
        });

        this.pending.push(mailPromise);
    }
}

export default EMInterface;