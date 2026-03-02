import { dbconnect } from "../../lib/mongodb";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = await dbconnect("hotEvent");
    const events = await db.collection("member").updateOne({ _id: body._id }, { $set: body }, { upsert: true });
    return { events, success: true };
});