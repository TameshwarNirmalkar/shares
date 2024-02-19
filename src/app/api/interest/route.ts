import connectMongoDB from "@db/connection/db-connection";
import InterestModel from "@db/models/interests";
import { getServerAuthSession } from "@server/auth";
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
      const response = await InterestModel.aggregate([{ $match: { uuid: session?.user?.user.id } }, { $unwind: '$investments' }, {
        $project: {
          "_id": '$investments._id',
          "investment_name": "$investments.investment_name",
          "investment_date": "$investments.investment_date",
          "amount": '$investments.amount',
          "percentage": '$investments.percentage',
          "interest_date": '$investments.interest_date',
          "calculated_amount": '$investments.calculated_amount',
          "parent_id": '$_id'
        }
      }]);
      const interestList = response;
      return NextResponse.json({ interestList, success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
  }
}

export async function DELETE(request: NextRequest) {
  const geth = request.headers.get("authorization");
  const secret = new TextEncoder().encode(SECRET_KEY);
  const hasBearer = geth?.split(" ") as string[];

  if (geth && hasBearer[0] !== "Bearer") {
    return NextResponse.json({ message: "Bearer not found" }, { status: 403 });
  } else if (!hasBearer[1]) {
    return NextResponse.json({ message: "Authorize token is not defined" }, { status: 403 });
  } else {
    try {
      const payload = await request.json();
      await jose.jwtVerify(`${hasBearer[1]}`, secret);
      await connectMongoDB();
      await InterestModel.updateOne(
        { _id: payload.parent_id },
        { $pull: { investments: { _id: payload._id } } },
      )
      return NextResponse.json({ message: "Item Delete Successfully.", success: true }, { status: 200 });
    } catch (error: any) {
      return NextResponse.json({ message: "Unauthorized", code: error.code, success: false }, { status: 403 });
    }
  }
}
