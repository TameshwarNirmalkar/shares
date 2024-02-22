import connectMongoDB from '@db/connection/db-connection';
import UserModel from '@db/models/users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await UserModel.findOne({ email }).select('_id');
    console.log('user: ', user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    const email = await req.nextUrl.searchParams.get('email');
    const user = await UserModel.findOne({ email }, { password: 0 });
    if (user) {
      return NextResponse.json({ user, message: 'User details successful', success: true }, { status: 200 });
    } else {
      return NextResponse.json({ user, message: 'User not found', success: false }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
  }
}
