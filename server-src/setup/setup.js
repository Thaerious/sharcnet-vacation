import FS from "fs";
import Path from "path";
import {mkdirif} from "@thaerious/utility";
import readline from "readline";
import dotenv from "dotenv";

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const it = rl[Symbol.asyncIterator]();

async function setup(){
    var env = {
        API_KEY: process.env.API_KEY,
        CALENDAR_ID: process.env.CALENDAR_ID,
        EMAIL_PORT: process.env.EMAIL_PORT || 587,
        EMAIL_HOST: process.env.EMAIL_HOST || `smtp.gmail.com`,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_USER: process.env.EMAIL_USER,
        EMAIL_PASSWD: process.env.EMAIL_PASSWD,
        LOG_DIR: process.env.LOG_DIR || `logs`,
        GKEY_FILENAME: process.env.GKEY_FILENAME || `private_key.json`,
        SERVER_NAME: process.env.SERVER_NAME
    };

    await apikey(env);
    await privatekey(env);
    await calendar(env);
    await email(env);

    rl.close();
    return env;
}

async function apikey(env) {
    console.log(`Browse to console.cloud.google.com/apis/credentials`);
    console.log(`Google API Key (${env.API_KEY || ''})>`)
    
    let value = (await it.next()).value;    
    env["API_KEY"] = value || env.API_KEY;
}

async function privatekey(env) {
    console.log(`Browse to console.cloud.google.com/iam-admin/serviceaccounts/`);
    console.log("Create a new json private key");
    console.log(`Private key filename (${env.GKEY_FILENAME || ''}) > `);
    
    let value = (await it.next()).value;    
    env["GKEY_FILENAME"] = value || env.GKEY_FILENAME;
}

async function calendar(env){
    console.log(`Open up the the google calendar (calendar.google.com).`);
    console.log(`Under 'My calendars' to the right of the calendar find the menu (3 vertical dots).`);
    console.log(`Select 'Settings and sharing'.`);
    console.log(`Under 'Share with specific people' add the service account email address.`);
    console.log(`Set that share to 'Make changes to events'.`);
    console.log(`Under 'Integrate calendar' copy the calendar id and paste it here.`);
    console.log(`Calendar ID (${env.CALENDAR_ID || ''}) > `)

    let value = (await it.next()).value;    
    env["CALENDAR_ID"] = value || env.CALENDAR_ID;
}

async function email(env){
    console.log(`Outgoing email account username (${env.EMAIL_USER || ''}) > `);
    env["EMAIL_USER"] = (await it.next()).value || env.EMAIL_USER;

    console.log(`Outgoing email account password (${env.EMAIL_PASSWD || ''}) > `);
    env["EMAIL_PASSWD"] = (await it.next()).value || env.EMAIL_PASSWD;

    console.log(`Outgoing email account port (${env.EMAIL_PORT || ''}) > `);
    env["EMAIL_PORT"] = (await it.next()).value || env.EMAIL_PORT;

    console.log(`Outgoing email account host (${env.EMAIL_HOST || ''}) > `);
    env["EMAIL_HOST"] = (await it.next()).value || env.EMAIL_HOST;

    console.log(`Outgoing email from (${env.EMAIL_FROM || ''}) > `);
    env["EMAIL_FROM"] = (await it.next()).value || env.EMAIL_FROM;
}

const env = await setup();
let out = "";
for(const key of Object.keys(env)){
    if (!env[key]) continue;
    const value = env[key];
    out += `${key}=${value}\n`;
}

FS.writeFileSync(".env", out);

