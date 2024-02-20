import { getServerAuthSession } from "@server/auth";
import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {

  const session = await getServerAuthSession();

  console.log("Request: ================== ", request);
  console.log("Response: ================== ", session);


  //   return NextResponse.redirect(new URL("/", request.url));
  //   return {};
}

export const config = {
  matcher: ["/dashboard"],
};
