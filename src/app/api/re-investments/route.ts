import connectMongoDB from "@db/connection/db-connection";
import ReInvestmentsModel from "@db/models/reInvestments";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function GET(request: NextRequest) {
    // const requestPaylod = await request.json();
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
            await connectMongoDB();
            const reInvestments = await ReInvestmentsModel.find({ uuid: payload.id });
            return NextResponse.json({ message: "Item successfully created", success: true, reInvestments }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function POST(request: NextRequest) {
    const requestPaylod = await request.json();
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
            await connectMongoDB();
            const data = await ReInvestmentsModel.create({ ...requestPaylod, uuid: payload.id });
            return NextResponse.json({ message: "Item successfully created", success: true, data }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function PATCH(request: NextRequest) {
    const payload = await request.json();
    const geth = request.headers.get("authorization");
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];

    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            await jose.jwtVerify(`${hasBearer[1]}`, secret);
            await connectMongoDB();
            await ReInvestmentsModel.updateOne({ _id: payload._id }, { $set: { ...payload, lastUpdate: "$$NOW" } }, { upsert: true });
            return NextResponse.json({ message: "Item Updated Successfully.", success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function DELETE(request: NextRequest) {
    const payload = await request.json();
    const geth = request.headers.get("authorization");
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];

    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            await jose.jwtVerify(`${hasBearer[1]}`, secret);
            await connectMongoDB();
            await ReInvestmentsModel.deleteOne({ _id: payload._id });
            return NextResponse.json({ message: "Item Delete Successfully.", success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
        }
    }
}