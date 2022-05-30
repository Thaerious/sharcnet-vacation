import DBInterface from "../../server-src/DBInterface.js";

const dbi = new DBInterface().open();
dbi.add("a", "b", "c", "d", "e", "f");
console.log(dbi.has("a", "b"));
console.log(dbi.has("a", "c"));
dbi.update("a", "b", "no status");
console.log(dbi.get("a", "b"));
