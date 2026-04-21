// see https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript

class Cookie {
    static setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    static getCookies(){
        const split = document.cookie.split(';');
        const map = new Map();

        for (const s of split){
            const i = s.indexOf('=');
            if (i === -1) continue;
            map.set(s.substring(0, i).trim(), s.substring(i + 1));
        }
        
        return map;
    }

    static getCookie(name) {
        return Cookie.getCookies().get(name);
    }

    static eraseCookie(name) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    static hasCookie(name) {
        return Cookie.getCookies().has(name);
    }    
}
window.Cookie = Cookie;
export default Cookie;