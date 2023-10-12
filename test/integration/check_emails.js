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
    imap.openBox('INBOX', false, () => {
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
    for (const headerline of mail.headerLines) {
        if (headerline.key === "x-snvac-id") {
            sanityCheckInterpolation(mail);
            break;
        }
    }
}

function sanityCheckInterpolation(mail) {
    const matchTXT = mail.text.match(/(%|\$){[^}]*}/g);
    const matchHTML = mail.html.match(/(%|\$){[^}]*}/g);

    if (matchTXT !== null) {
        console.log(`\nIterpolation check failed:`);
        console.log("data chunk: TEXT");
        console.log(`TO: ${mail.to.text}`);
        console.log(getHeader(mail, "subject"));
        console.log(matchTXT);
    }

    if (matchHTML !== null) {
        console.log(`\nIterpolation check failed:`);
        console.log("data chunk: HTML");
        console.log(`TO: ${mail.to.text}`);
        console.log(getHeader(mail, "subject"));
        console.log(matchHTML);
    }
}

function getHeader(mail, key) {
    for (const headerline of mail.headerLines) {
        if (headerline.key === key) {
            return headerline.line;
        }
    }
}

imap.connect();