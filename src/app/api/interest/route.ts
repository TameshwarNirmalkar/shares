import connectMongoDB from "@/db/connection/db-connection";
import InterestModel from "@/db/models/interests";
import { getServerAuthSession } from "@/server/auth";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: string | undefined = process.env.JWT_SECERT_KEY;

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const geth = request.headers.get("authorization");
  console.log("Paylod: ", payload);
  const session = await getServerAuthSession();
  console.log("session: ", session);

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
      await InterestModel.create(payload);
      return NextResponse.json({ message: "Interest successfully created", success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
  }
}

export async function GET(request: NextRequest) {
  const geth = request.headers.get("authorization");
  const session: any = await getServerAuthSession();

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
      const response = await InterestModel.find({ uuid: session?.user?.user.id });
      const interestList = response.reduce((ite, acc) => {
        return ite.concat(acc.investments);
      }, []);

      return NextResponse.json({ interestList, success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
  }
}
