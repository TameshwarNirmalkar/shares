import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname, origin } = request.nextUrl
  // const session = await getServerAuthSession();
  const session = request.cookies.get('next-auth.session-token');

  // console.log("Request: ================== ", request.cookies.get('next-auth.session-token'));
  // console.log("Response: ================== ", request);
  if (!session) {
    // console.log("Session: =================", request.url);
    // return NextResponse.redirect('/login');
    return NextResponse.rewrite(`${origin}/login`)
  }

  // return NextResponse.next();


  //   return NextResponse.redirect(new URL("/", request.url));
  //   return {};
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
