import connectMongoDB from "@db/connection/db-connection";
import UserModel from "@db/models/users";
import bcrypt from "bcryptjs";
import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY: any = process.env.JWT_SECERT_KEY;
const SECERT_REFRESH_KEY: any = process.env.JWT_SECERT_REFRESH_KEY;
const alg = "HS256";

type ResponseData = {
  message: string;
  success: boolean;
};

type UserT = {
  email: string;
  full_name: string;
  _id: string;
  id: string;
  image: string;
  profile_image: string;
  password: string;
  address: string;
  whatsapp: string;
}

export async function POST(request: NextRequest, response: NextResponse<ResponseData>) {
  const { email, password } = await request.json();
  try {
    await connectMongoDB();
    let user = await UserModel.findOne({ email }) as UserT;
    if (!user) {
      return NextResponse.json({ message: "User does not match.", success: false }, { status: 403 });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: "Password does not match.", success: false }, { status: 403 });
    }

    const signature = new TextEncoder().encode(SECRET_KEY);
    const refreshSignature = new TextEncoder().encode(SECERT_REFRESH_KEY);

    const payload = {
      name: user.full_name,
      email: user.email,
      id: user._id,
      image: user.profile_image,
      // address: user.address,
      // whatsapp: user.whatsapp
    };
    const accessToken = await new jose.SignJWT(payload).setProtectedHeader({ alg }).setExpirationTime("24h").sign(signature);
    const refreshToken = await new jose.SignJWT(payload).setProtectedHeader({ alg }).setExpirationTime("1y").sign(refreshSignature);

    const response = NextResponse.json(
      {
        accessToken,
        user: payload,
        message: "Successfully loggedin.",
        success: true,
      },
      { status: 200 }
    );

    // response.cookies.set({
    //   name: "jwt_token",
    //   value: accessToken,
    //   maxAge: 30 * 24 * 60 * 60, // 30 day
    // });
    // response.cookies.set({
    //   name: "jwt_refresh_token",
    //   value: refreshToken,
    //   maxAge: 60 * 60 * 24 * 30 * 12, // 1 year
    // });
    // setCookie("jwt_token", `${accessToken}`, { maxAge: 60 * 60 });
    // setCookie("jwt_refresh_token", `${refreshToken}`, { maxAge: 60 * 60 * 24 * 30 * 12 });

    return response;
  } catch (error: any) {
    return NextResponse.json({
      message: error.toString(),
      success: false,
    });
  }
}
