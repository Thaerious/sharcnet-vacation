import Express from "express";
import passport from "passport";
import saml from "@node-saml/passport-saml";
import fs from "fs";

console.log(saml);
console.log(saml.Strategy);

passport.use(
    new saml.Strategy({
        path: "https://edward.sharcnet.ca//Shibboleth.sso/SAML2/POST",
        passReqToCallback: true,
        privateKey: fs.readFileSync("./keys/sp-signing-key.pem", "utf-8"),   
        cert: "MIIEFDCCAnygAwIBAgIUSqx7Acd/7Wqfp/fYHrMgfgUBoNowDQYJKoZIhvcNAQELBQAwITEfMB0GA1UEAwwWaWRwLWFsbGlhbmNlLm1pdC5jMy5jYTAeFw0yMjA1MTMwMjAxNTZaFw00MjA1MTMwMjAxNTZaMCExHzAdBgNVBAMMFmlkcC1hbGxpYW5jZS5taXQuYzMuY2EwggGiMA0GCSqGSIb3DQEBAQUAA4IBjwAwggGKAoIBgQC7seyX1Ht2P1JlP9N8k/9gVwEXU+WwIDCdaOzGXQi+paBXG8lMOoTUfyi15pgY/J4ufzJY5qlg6HnKgjmNouOPgsHC+05S6X2VfwG/WRPNG5PRA9HSn06n8vTBUne2FrjzK7wviOz1eTNuUSB6aliiHy866qab2e0uELtIEKmT6ptblYUOEhV4ggdcmKxomdslMKJ/JRbyHoQ0E124zNWwsssJigYz8XptWEUx/dfRMlrAJiPgqmxKfpqUAfhdSgXCGl5dIVtmCno816Umpe7m2EoGSQWAwDr6g1KR2qxMBF+z41UM4ywT2x1ukeX1Ud57f7luekQlcphWTbYNNyO6/bZH1y9+pVbf0Wngep9Qwf5ODpL+ddVlbKKR3TWHcbcx0vtAhRCLX7RpSV8iXOkXuh4v8xtjs06LlXO2qN9a2lxquId5E1IeVyuPAvKgPk1SxEQUHQRUgFRxyYWclMfwvSov2V83VS5WGd1LEBvTKilI9TFotMzT9cIYtqa5TTUCAwEAAaNEMEIwHQYDVR0OBBYEFB2lYJM67136/toGEZQunFyvu9JyMCEGA1UdEQQaMBiCFmlkcC1hbGxpYW5jZS5taXQuYzMuY2EwDQYJKoZIhvcNAQELBQADggGBAGBpQkmD/CKDvOkNfxpgTyJbllQjeir+Zt4nEbDsDIXfg28ZIBGSucT0vvLAnX5fi6PB+HUpwLQVGLhr6BEriMoeKMRMWvWOlOGKmFXJdN9Ol0a+HzZWjp1yCJYL38BdCz+RDNxvWNSYvFcTgd5qGAY9ycg/USwgP3itnFEbxAP/liQRgxaIIJqf6aZhDpNJ+JMkR0fqW4ke2xs84FisKstXHr97fYZeU2Cmkl8/V+FoG2Py0k2WlJ3OFMth6Dlxq2+MZxwJmqTRPBLYoAE122aJe9FBWc9g+OxHyA1SPnZgK6vsKFrbrUZkk8IRbW2bcd1LS5lLog63VafY75S8LMSWkbhSeE7r6KwZmAeexiFI6CX4Qyu/bUbjYwLRzggRyInHPDH+uQMoxOGU4Uqbf5mfxk8SqGdxLc6VtBUPWN+H2rGTCh6sfSlefvPUZnNCMSr8Mm+pssTX05+4mAFeBp3ptZu/aJHJzX2NxyIlx2dNQ8ajYjz3rHGrhLVr3i+khQ==",
        entryPoint: "https://idp-alliance.mit.c3.ca/idp/profile/SAML2/Redirect/SSO",
        issuer: "https://idp-alliance.mit.c3.ca/idp/shibboleth"
    },
        signOn,
        signOff
    )
);

function signOn(profile, done) {
    console.log("signon");
    console.log(profile);
    return done(null, "none");
}
 
function signOff(profile, done) {
    console.log("signoff");
    console.log(profile);
    return done(null, "none");
}

const route = Express.Router();
route.use("/",
    (req, res, next) => { console.log("Shib Handler"); next(); },
    passport.authenticate(
        "saml",
        { failureRedirect: "/", failureFlash: true }
    ),
    function (req, res) {
        console.log("redirect function");
        res.redirect("/");
    }
);

export default route;
