import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_DOMAINS = [
  "localhost",
  "portfolio-craft.com",
  "www.portfolio-craft.com",
  "portfolio-craft-swain.vercel.app",
];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const pathname = request.nextUrl.pathname;

  // Custom domain handling
  if (!MAIN_DOMAINS.some((d) => host.includes(d))) {
    if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
      return NextResponse.next();
    }
    if (!pathname.startsWith("/custom-domain")) {
      return NextResponse.rewrite(
        new URL(`/custom-domain${pathname}`, request.url),
      );
    }
  }

  // Dashboard protection
  const token = request.cookies.get("token")?.value;
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)'],
}
