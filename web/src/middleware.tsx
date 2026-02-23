import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const HOME_PAGE = new URL("/users", request.url);

  // If you don't have a token and try to access a private route
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If you are already logged in and are trying to log in.
  if (token && isAuthPage) {
    return NextResponse.redirect(HOME_PAGE);
  }

  return NextResponse.next();
}

// Defines which routes the middleware should observe.
export const config = {
  matcher: ["/login", "/register", "/users", "/dashboard/:path*"],
};
