import Path from "path";
import FS from "fs"

export default function mkdirif(...paths) {
    const path = Path.join(...paths);

    if (path.endsWith(`/`)) {
        if (!FS.existsSync(path)) {
            FS.mkdirSync(path, { recursive: true });
        }
    } else {
        const parsed = Path.parse(path);

        if (!parsed.dir || parsed.dir === ``) return path;

        if (!FS.existsSync(parsed.dir)) {
            FS.mkdirSync(parsed.dir, { recursive: true });
        }
    }

    return path;
}