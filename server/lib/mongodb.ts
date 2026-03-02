import { MongoClient } from "mongodb";
async function dbconnect(dbName: string) {
    const config = useRuntimeConfig();
    const connected = new MongoClient(config.private.mongodbUri);
    await connected.connect();
    const db = connected.db(dbName);
    return db;
}
export { dbconnect };
