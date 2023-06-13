console.log("index.js");

function init() {
    gapi.load('auth2', function () {
        gapi.auth2.init({
            client_id: '1086983655514-3hctr1oqgdq4r9ab64mu22jnog93aqcc.apps.googleusercontent.com',
        });

        gapi.signin2.render('g-signin-button', {
            'scope': 'email',
            'onsuccess': handleSignIn
        });
    });
}

init();