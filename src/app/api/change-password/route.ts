import connectMongoDB from "@db/connection/db-connection";
import UserModel from "@db/models/users";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function POST(request: NextRequest) {
    // const session = await getServerAuthSession() as any;
    const geth = request.headers.get("authorization");
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];

    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            const { old_password, confirm_password } = await request.json();
            await connectMongoDB();
            const { payload } = await jose.jwtVerify(`${hasBearer[1]}`, secret);
            const user = await UserModel.findOne({ _id: payload.id });
            const isMatch = await bcrypt.compare(old_password, user.password);
            if (isMatch) {
                const hashedPassword = await bcrypt.hash(confirm_password, 10);
                await UserModel.updateOne({ _id: payload.id }, { password: hashedPassword });
                return NextResponse.json({ message: "Password changed successfully.", success: true }, { status: 200 });
            } else {
                return NextResponse.json({ message: 'Old Password is not matching', success: false }, { status: 200 });
            }

        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), success: false }, { status: 200 });
        }
    }
}