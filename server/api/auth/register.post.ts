import { dbconnect } from "../../lib/mongodb";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;
    const db = await dbconnect("hotEvent");
    const user = await db.collection("member").findOne({ username });
    if (user) {
        return { error: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("member").insertOne({ username, password: hashedPassword, ...body });
    return { success: true };
});