import FS from "fs";
import { loadTemplate } from "@thaerious/utility";
import nodemailer from "nodemailer";
import juice from "juice";


class EMInterface {
    /**
     * @param {string} login The username of the email account.
     * @param {string} password The password of the email account.
     */
    constructor(login, password) {
        this.login = login;
        this.password = password;
    }

    /**
     * Send 'filename' to 'email' using 'data' for templates.
     */
    async sendFile(email, filename, subject, data) {
        const htmlSrc = loadTemplate(filename, data);
        const html = juice(htmlSrc);
        await this.send(email, subject, html);
    }

    async send(email, subject, html) {
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: this.login,
                pass: this.password,
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"SHARCNET Vacation Mailer" <${this.login}>`,
            to: email, // list of receivers
            subject: subject, // Subject line
            text: "", // plain text body
            html: html, // html body
        });
    }
}

export default EMInterface;
