export default function throwIfNot(...objects) {
    for (const index in objects) {
        const object = objects[index];
        if (object === undefined) throw new Error(`undefined object at pos ${index}`);
        if (object === null) throw new Error(`null object at pos ${index}`);
    }
}