// Pull the emails from the server and check for unfullfilled document interpolation.

import Imap from "imap";
import dotenv from "dotenv";
import { simpleParser } from "mailparser";

dotenv.config();

const imapConfig = {
    user: process.env["EMAIL_USER"],
    password: process.env["EMAIL_PASSWD"],
    host: process.env["EMAIL_HOST"],
    port: 993,
    tls: true,
    tlsOptions: {
        rejectUnauthorized: false
    }
};

const imap = new Imap(imapConfig);

imap.once('ready', () => {
    console.log("ready");
    imap.openBox('INBOX', false, () => {
        console.log("open");
        imap.search(['UNSEEN'], (err, results) => {
            const f = imap.fetch(results, { bodies: '' });
            f.on('message', msg => {
                msg.on('body', stream => {
                    simpleParser(stream, async (err, parsed) => {
                        processMail(parsed);
                    });
                });
            });
            f.once('error', ex => {
                return Promise.reject(ex);
            });
            f.once('end', () => {
                console.log('Done fetching all messages!');
                imap.end();
            });
        });
    });
});

function processMail(mail) {
    console.log(`\nTo: ${mail.to.value[0].address}`);
    for (const headerline of mail.headerLines) {
        if (headerline.key == "subject") {
            console.log(headerline.line);
        }
    }
    console.log(mail.text);
    console.log(mail.html);
    sanityCheckInterpolation(mail);
}

function sanityCheckInterpolation(mail) {
    const index1 = mail.text.search(/(%|\$){[^}]*}/);
    const index2 = mail.html.search(/(%|\$){[^}]*}/);
    console.log(index1, index2);
}

imap.connect();