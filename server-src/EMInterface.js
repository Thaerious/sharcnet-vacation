import { loadTemplate } from "@thaerious/utility";
import nodemailer from "nodemailer";


/**
 * Email Interface
 */
class EMInterface {
    /**
     * @param {string} login The username of the email account.
     * @param {string} password The password of the email account.
     */
    constructor() {
        this.user = process.env.EMAIL_USER
        this.password = process.env.EMAIL_PASSWD
        this.port = process.env.EMAIL_PORT
        this.host = process.env.EMAIL_HOST
        this.from = process.env.EMAIL_FROM
    }

    /**
     * Send 'filename' to 'email' using 'data' for templates.
     */
    async sendFile(email, filename, subject, data) {
        const html = loadTemplate(filename, data);
        await this.send(email, subject, html);
    }

    async send(email, subject, html) {
        let transporter = nodemailer.createTransport({
            host: this.host,
            secure: false,
            port: this.port,
            auth: {
                user: this.login,
                pass: this.password,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"SHARCNET Vacation Mailer" <${this.from}>`,
            to: email,        // list of receivers
            subject: subject, // Subject line
            text: "",         // plain text body
            html: html,       // html body
        });
    }
}

export default EMInterface;
