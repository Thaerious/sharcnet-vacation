import Path from "path";
import FS from "fs"

// Joins path segments and ensures the relevant directory exists, creating it if needed.
// - Trailing slash: treats the full path as a directory and creates it.
// - No trailing slash: treats the path as a file and creates its parent directory.
//   If there is no parent component (bare filename), returns immediately without touching the fs.
// Returns the joined path in all cases.
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