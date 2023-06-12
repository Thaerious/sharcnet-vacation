import express from 'express';
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = 'http://127.0.0.1/verify';

console.log(clientID);
console.log(clientSecret);
console.log(redirectURI);
const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);

console.log("EMAIL ADDRESS SERVER");

app.use(`*`, (req, res, next) => {
    console.log(req.method + ` ` + req.originalUrl);
    next();
});

app.get('/auth', (req, res) => {
    const authUrl = oauth2Client.generateAuthUrl({
        scope: ['https://www.googleapis.com/auth/userinfo.email']
    });
    res.redirect(authUrl);
});

app.get('/verify', async (req, res) => {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });

    oauth2.userinfo.get((err, { data }) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving user information');
            return;
        }

        const userEmail = data.email;
        // Use the userEmail as needed
        console.log(userEmail);

        res.send(`User email: ${userEmail}`);
    });
});

app.listen(80, "0.0.0.0", () => {
    console.log('Server running on port 3000');
});
