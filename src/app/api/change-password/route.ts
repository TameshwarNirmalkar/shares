import connectMongoDB from "@db/connection/db-connection";
import UserModel from "@db/models/users";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { _id, old_password, confirm_password } = await request.json();
        await connectMongoDB();
        const user = await UserModel.findOne({ _id });
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (isMatch) {
            const hashedPassword = await bcrypt.hash(confirm_password, 10);
            await UserModel.updateOne({ _id }, { password: hashedPassword });
            return NextResponse.json({ message: "Password changed successfully.", success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Password is not matching', success: false }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.toString(), success: false }, { status: 200 });
    }
}