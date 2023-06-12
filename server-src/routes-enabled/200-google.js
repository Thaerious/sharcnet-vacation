import Express from "express";
import { OAuth2Client } from "google-auth-library";
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

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CONST.GOOGLE.CLIENT_ID
    });
   
    const payload = ticket.getPayload();    

    if (payload.aud !== CONST.GOOGLE.CLIENT_ID || payload.iss !== CONST.GOOGLE.GOOGLE_URL) {
        return false;
    } else {
        return await discoveryDocument(ticket, token);    
    }
}

async function discoveryDocument(ticket, token) {
    const discoverDocument = await (await fetch(CONST.GOOGLE.DISCOVERY_URL)).json();
    const json = await fetch(discoverDocument.jwks_uri);
    const googleKeys = (await json.json()).keys;

    const parts = token.split('.');    
    const content = [parts[0], parts[1]].join(".");
    const signature = base64url.toBase64(parts[2]);

    for (const key of googleKeys) {
        if (key.kid === ticket.envelope.kid) {            
            const modulus = key.n;
            const exponent = key.e;
            const publicKey = getPem(modulus, exponent);
            const verifier = crypto.createVerify('RSA-SHA256');
            verifier.update(content);
            const r = verifier.verify(publicKey, signature, 'base64');
            return r;
        }
    }

    return false;
}

// Called by the Google api when an auth event takes place.
router.use("/verify$",       
    bodyParser.urlencoded({ extended: true }),
    async (req, res, next) => {
        const verified = await verify(req.body.credential).catch((error) => {
            handleError(res, {
                message: error,
                status: CONST.STATUS.REJECTED
            });            
        });

        if (verified) {
            logger.verbose('google redirect');
            req.session[CONST.SESSION.LOGGED_IN] = true;
            res.redirect("/");
        }
    }
);

export { router as default, verify }

//[1] https://ncona.com/2015/02/consuming-a-google-id-token-from-a-server/
//[2] https://developers.google.com/identity/protocols/oauth2/scopes#oauth2v2