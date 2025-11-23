import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // convert headers to plain object for auth client
  const headersObj = Object.fromEntries(request.headers.entries());

  const session = await auth.api.getSession({
    headers: headersObj,
  });

  const { pathname } = new URL(request.url);

  // If not authenticated, force to signIn (but allow access to signIn itself)
  if (!session && pathname !== "/signIn") {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  // If authenticated, prevent visiting the signIn page
  if (session && pathname === "/signIn") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signIn"],
};
