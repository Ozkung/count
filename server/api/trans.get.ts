import { dbconnect } from "../lib/mongodb";

export default defineEventHandler(async (event) => {
    const db = await dbconnect("hotEvent");
    const events = await db.collection("events_trans").find({}).toArray();
    return { events };
});