import Express from "express";
import axios from "axios";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import bodyParser from "body-parser";
import getPem from 'rsa-pem-from-mod-exp';
import crypto from "crypto";
import base64url from "base64url";
import CONST from "../constants.js";
import handleResponse from "../handleResponse.js";
import handleError from "../handleError.js";
import logger from "../setupLogger.js";

const router = Express.Router();
const client = new OAuth2Client(CONST.GOOGLE.CLIENT_ID);

router.use("/verify$",
    bodyParser.urlencoded({ extended: true }),
    async (req, res, next) => {
        console.log(req.body.credential);
        req.session[CONST.SESSION.LOGGED_IN] = true;
        res.redirect("/app");

        const token = await exchangeCodeForToken(req.body.credential);
        console.log(token);
    }
);

async function exchangeCodeForToken(code) {
    console.log(code);

    const data = {
        code: code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: 'https://127.0.0.1',
        grant_type: 'authorization_code'
    };

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', data);
        return response.data;
    } catch (error) {
        console.error('Error exchanging authorization code for token:', error);
        return null;
    }
}

export default router;

//[1] https://ncona.com/2015/02/consuming-a-google-id-token-from-a-server/
//[2] https://developers.google.com/identity/protocols/oauth2/scopes#oauth2v2