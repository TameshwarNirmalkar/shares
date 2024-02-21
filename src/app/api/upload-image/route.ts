import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;
const IMBB_SECERET_KEY: string | undefined = process.env.NEXT_PUBLIC_IMBB_SECERET_KEY

export async function POST(request: NextRequest) {
    const payload = await request.formData();
    try {
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMBB_SECERET_KEY}`, {
            method: "POST",
            body: payload,
        }).then((res) => res.json());
        return NextResponse.json({ message: "Image uploaded successfully", success: true, data: res.data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
}