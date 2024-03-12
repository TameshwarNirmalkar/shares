import { NextRequest, NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest, response: NextResponse) {
  const { pathname, origin } = request.nextUrl
  // const session = await getServerAuthSession();
  const session = request.cookies.get('next-auth.session-token')?.value;

  console.log("Middleware Pathname: ================== ", pathname);
  // console.log("Response: ================== ", request);

  if (['/', '/login', '/register'].includes(pathname)) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    // access secured routes.
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // if (!session) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  //   // return NextResponse.rewrite(`${origin}/login`)
  // } else {
  //   if (['/login', '/register'].includes(pathname)) {
  //     return NextResponse.redirect(new URL("/dashboard", request.url));
  //   }
  // }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    // '/login',
    // '/register',
    '/dashboard/:path*',
    '/add_clients/:path*',
    '/client_list/:path*',
    '/payments/:path*',
    '/transaction/:path*',
    '/master-investment/:path*',
    '/my-investments/:path*',
    '/stakeholder/:path*',
    '/interest-calculator/:path*',
    '/my-profile/:path*',
    '/re-investments/:path*',
    '/investment-list/:path*',
    '/((?!_next/static|favicon.ico|api/auth|$).*)',
    // '/api/:path*',
  ],
};
