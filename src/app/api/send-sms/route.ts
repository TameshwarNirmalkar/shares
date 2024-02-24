import { NextRequest, NextResponse } from "next/server";

const client = require('twilio')('ACa56c4ed4f0127d22d87505e262d069ae', '774628dce120080e2b958da552e8fcca');

export async function POST(request: NextRequest) {
    // const session = await getServerAuthSession() as any;
    try {
        const { phone, message } = await request.json();

        const send_sms_result = await client.messages.create({
            // from: "whatsapp:+14155238886",
            from: "+15407070957",
            body: message,
            to: phone
        });

        console.log("RES: ", send_sms_result);


        return NextResponse.json({ send_sms_result, success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.toString(), success: false }, { status: 200 });
    }
}