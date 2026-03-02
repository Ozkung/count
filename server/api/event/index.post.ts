import { dbconnect } from "../../lib/mongodb";
import { generate } from "referral-codes";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const db = await dbconnect("hotEvent");
    const events = await db.collection("events").insertOne({ ...body });
    const memberAllLenght = await db.collection("member").countDocuments();
    // referralCode
    const referralCode = generate({
        length: 8,
        count: memberAllLenght,
    })

    const referral = await db.collection("inviteCode").insertMany(referralCode.map((code) => ({ code, eventId: events.insertedId.toString(), status: "pending", createAt: new Date() })));
    return { referralCode, referral, success: true };
});