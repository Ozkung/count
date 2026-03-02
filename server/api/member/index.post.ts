import { dbconnect } from "../../lib/mongodb";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = await dbconnect("hotEvent");
    const events = await db.collection("member").insertOne({ ...body });
    return { events, success: true };
});