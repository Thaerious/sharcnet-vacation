import Express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

const router = Express.Router();
const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectURI = 'https://127.0.0.1/verify';
const oauth2Client = new google.auth.OAuth2(clientID, clientSecret, redirectURI);

router.post('/auth',
    bodyParser.urlencoded({ extended: true }),
    (req, res) => {
        console.log(req.body);
        const authUrl = oauth2Client.generateAuthUrl({
            scope: ['https://www.googleapis.com/auth/userinfo.email']
        });
        res.redirect(authUrl);
    });

router.post('/verify',
    bodyParser.urlencoded({ extended: true }),
    async (req, res) => {
        console.log(req.body);
        
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

export default router;