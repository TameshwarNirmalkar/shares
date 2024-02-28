import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function POST(request: NextRequest) {
    const requestData = await request.json();
    const geth = request.headers.get("authorization");
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];

    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            const { payload } = await jose.jwtVerify(`${hasBearer[1]}`, secret);
            // await connectMongoDB();
            // const res = await MyClientsModel.create({ ...requestData, uuid: payload.id });
            return NextResponse.json({ message: "Otp Verified.", success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
        }
    }
}