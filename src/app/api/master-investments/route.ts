import connectMongoDB from "@db/connection/db-connection";
import MasterInvestmentModel from "@db/models/masterInvestments";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function GET(request: NextRequest) {
    // const { _id, ...updateModel } = await request.json();
    const geth = request.headers.get("authorization");
    // const session = await getServerAuthSession();
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];
    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            const { payload } = await jose.jwtVerify(`${hasBearer[1]}`, secret);
            if (payload) {
                await connectMongoDB();
                const masterList = await MasterInvestmentModel.find({ uuid: payload.id });
                return NextResponse.json({ message: "Master list fetched successfully.", success: true, masterList }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Token Expired, please login again", success: false }, { status: 200 });
            }

        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function POST(request: NextRequest) {
    const { _id, ...updateModel } = await request.json();
    const geth = request.headers.get("authorization");
    // const session = await getServerAuthSession();
    const secret = new TextEncoder().encode(SECRET_KEY);
    const hasBearer = geth?.split(" ") as string[];
    if (geth && hasBearer[0] !== "Bearer") {
        return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
    } else if (!hasBearer[1]) {
        return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
    } else {
        try {
            const { payload } = await jose.jwtVerify(`${hasBearer[1]}`, secret);
            if (payload) {
                await connectMongoDB();
                const data = await MasterInvestmentModel.create({ ...updateModel, uuid: payload.id });
                return NextResponse.json({ message: "Master Interest successfully created", success: true, data }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Token Expired, please login again", success: false }, { status: 200 });
            }

        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function PATCH(request: NextRequest) {
    const updateModel = await request.json();
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
            if (payload) {
                await connectMongoDB();
                const data = await MasterInvestmentModel.findOneAndUpdate({ _id: updateModel._id }, { $set: { ...updateModel, uuid: payload.id } }, { new: true, upsert: true });
                return NextResponse.json({ message: "Item updated successfully", success: true, data }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Token Expired, please login again", success: false }, { status: 200 });
            }

        } catch (error: any) {
            return NextResponse.json({ message: error.toString(), code: error.code, success: false }, { status: 403 });
        }
    }
}

export async function DELETE(request: NextRequest) {
    const { _id } = await request.json();
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
            if (payload) {
                await connectMongoDB();
                await MasterInvestmentModel.deleteOne({ _id });
                return NextResponse.json({ message: "Item Delete Successfully.", success: true }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Token Expired, please login again", success: false }, { status: 200 });
            }
        } catch (error: any) {
            return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
        }
    }
}