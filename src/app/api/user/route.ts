import connectMongoDB from "@db/connection/db-connection";
import UserModel from "@db/models/users";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function POST(request: NextRequest) {
  const { email, phone, full_name, password } = await request.json();
  const hashedPassword = await bcrypt.hash(password, 10);
  await connectMongoDB();
  const user = await UserModel.findOne({ email }).select("_id");
  if (user) {
    return NextResponse.json({ message: "User already exist.", success: false }, { status: 200 });
  } else {
    await UserModel.create({ email, phone, full_name, password: hashedPassword });
    return NextResponse.json({ message: "User created successfully.", success: true }, { status: 200 });
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  const geth = request.headers.get("authorization");
  // const session = (await getServerAuthSession()) as any;

  const secret = new TextEncoder().encode(SECRET_KEY);
  const hasBearer = geth?.split(" ") as string[];

  if (geth && hasBearer[0] !== "Bearer") {
    return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
  } else if (!hasBearer[1]) {
    return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
  } else {
    try {
      // const { payload, protectedHeader } = await jose.jwtVerify(`${session.user.accessToken}`, secret);
      await jose.jwtVerify(`${hasBearer[1]}`, secret);
      await connectMongoDB();
      const userList = await UserModel.aggregate([
        {
          $project: { password: 0 },
        },
      ]);
      return NextResponse.json({ userList, success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code }, { status: 403 });
    }
  }
}

export async function PATCH(request: NextRequest, response: NextResponse) {
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
      await jose.jwtVerify(`${hasBearer[1]}`, secret);
      await connectMongoDB();
      const { _id, full_name, email, phone, whatsapp, address, profile_image } = await request.json();
      const res = await UserModel.findOneAndUpdate(
        { _id: _id },
        {
          $set: { _id, full_name, email, phone, whatsapp, address, profile_image },
          $currentDate: { lastUpdate: true },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({ message: "User details updated successfully", success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code }, { status: 403 });
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
      await UserModel.deleteOne({ _id: payload.id });
      return NextResponse.json({ message: "User Delete Successfully.", success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
  }
}
