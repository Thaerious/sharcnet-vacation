import Logger from "@thaerious/logger";
import {mkdirif} from "@thaerious/utility";
import FS from "fs";

const appLogger = new Logger();

const errorChannel = appLogger.channel("error");
appLogger.channel(`standard`).enabled = true;
appLogger.channel(`verbose`).enabled = false;

errorChannel.log = function(string){
    console.error("Error: see log files");
    const path = mkdirif(process.env.LOG_DIR, "error.log");
    FS.appendFileSync(path, "\n *** " + new Date().toString() + "\n" + string + "\n");
}

export default appLogger.all();