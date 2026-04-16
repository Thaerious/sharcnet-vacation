/**
 * Throws an error if any of the provided named values are `undefined` or `null`.
 *
 * @param {{ [name: string]: any }} fields - Object mapping argument names to their values.
 * @throws {Error} with the name of the missing field.
 *
 * @example
 * throwIfNot({ arg1, arg2 }); // Throws an error if arg1 or arg2 is undefined or null
 */
export default function throwIfNot(fields) {
    for (const [name, value] of Object.entries(fields)) {
        if (value === undefined) throw new Error(`undefined value for '${name}'`);
        if (value === null) throw new Error(`null value for '${name}'`);
    }
}