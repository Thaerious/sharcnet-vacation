/**
 * Throws an error if any of the provided arguments are `undefined` or `null`.
 * This function is useful for validating function arguments to ensure they are not
 * unintentionally missing or set to null.
 *
 * @param {...any} objects - A rest parameter that takes any number of arguments.
 *                           Each argument is checked to ensure it is not `undefined` or `null`.
 * @throws {Error} Throws an error indicating the position (zero-indexed) of the argument
 *                 that is `undefined` or `null`, providing a clear message for debugging.
 *
 * @example
 * throwIfNot(arg1, arg2); // Throws an error if arg1 or arg2 is undefined or null
 */
export default function throwIfNot(...objects) {
    for (const index in objects) {
        const object = objects[index];
        if (object === undefined) throw new Error(`undefined object at pos ${index}`);
        if (object === null) throw new Error(`null object at pos ${index}`);
    }
}