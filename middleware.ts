import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { baseUrl } from "./lib/baseUrl";

export async function middleware(request: NextRequest) {
  const { url, nextUrl, cookies } = request;
  const token = cookies.get("accessToken")?.value;

  const res = await fetch(new URL(`${baseUrl}/checkLogin`).href, {
    method: "GET",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    if (nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/dashboard/storage-report", url));
    }
    return NextResponse.next();
  }

  if (!nextUrl.pathname.startsWith("/login")) {
    const response = NextResponse.redirect(new URL("/login", url));
    response.cookies.delete("profile");
    response.cookies.delete("accessToken");
    return response;
  }
  const response = NextResponse.next();
  response.cookies.delete("profile");
  response.cookies.delete("accessToken");
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
