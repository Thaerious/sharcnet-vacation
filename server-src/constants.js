import Path from "path";


const loc = {
    "SERVER_ASSETS" : "server-assets",        
};

loc.html = {
    "BAD_REQUEST_400" : Path.join(loc.SERVER_ASSETS, "400_bad_request.html")
}

export default {
    loc : loc
};