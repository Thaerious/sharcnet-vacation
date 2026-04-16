import FS from "fs"

/**
 * Load a text file with template variables, replacing the variables
 * with values from 'pairs' object.
 */
function loadAsset(filename, pairs) {
    let text = FS.readFileSync(filename, `utf-8`);
    for (const search in pairs){
        const replace = pairs[search];
        text = text.replaceAll("${" + search + "}", replace);
    }
    return text;
}

export default loadAsset