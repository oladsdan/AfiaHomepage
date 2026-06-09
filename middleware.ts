import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, expectedSessionToken } from "@/lib/adminSession";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isApi = pathname.startsWith("/api/admin");

  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/admin/login/") ||
    pathname === "/api/admin/auth"
  ) {
    return NextResponse.next();
  }

  const expected = await expectedSessionToken();
  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (expected && token && token === expected) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const url = req.nextUrl.clone();
  const dest = `${pathname}${req.nextUrl.search || ""}`;
  url.pathname = "/admin/login";
  url.search = "";
  if (dest !== "/admin" && dest.startsWith("/admin")) {
    url.searchParams.set("next", dest);
  }
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
