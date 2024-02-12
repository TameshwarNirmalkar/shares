import connectMongoDB from '@/db/connection/db-connection';
import User from '@/db/models/users';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const user = await User.findOne({ email }).select('_id');
    console.log('user: ', user);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
