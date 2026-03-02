import { dbconnect } from "../../lib/mongodb";

export default defineEventHandler(async (event) => {
    const db = await dbconnect("hotEvent");
    const events = await db.collection("member").find({}).toArray();
    return { events };
});