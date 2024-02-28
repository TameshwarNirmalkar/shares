import connectMongoDB from "@db/connection/db-connection";
import OtpModel from "@db/models/otp";
import UserModel from "@db/models/users";
import { NextRequest, NextResponse } from "next/server";
import otpGenerator from "otp-generator";

// const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function POST(request: NextRequest) {
    const { email, otp } = await request.json();
    await connectMongoDB();

    try {
        let otpGenerate = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Check if user is already present
        const checkUserPresent = await UserModel.findOne({ email });
        if (checkUserPresent) {
            return NextResponse.json({ message: "User is already registered.", success: false }, { status: 200 })
        }

        let result = await OtpModel.findOne({ otp: otp });
        while (result) {
            otpGenerate = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
            });
            // result = await OtpModel.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };
        const otpBody = await OtpModel.create(otpPayload);
        return NextResponse.json({ message: "OTP Send.", success: true, data: otpBody }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
}
