import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Specify protected and public routes
const protectedRoutes = ["/tracker", "/journal", "/goals", "/settings", "/lists", "/focus", "/countdowns", "/health", "/onboarding"];
const authOnlyPublicRoutes = ["/login", "/signup"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get session cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 1. Unauthenticated visitors on "/" see the public landing & pricing page at "/welcome"
  if (path === "/" && !session?.userId) {
    return NextResponse.rewrite(new URL("/welcome", req.nextUrl));
  }

  // Quick checks to see if route needs auth or is login/signup
  const isProtectedRoute =
    path.startsWith("/tracker") ||
    path.startsWith("/journal") ||
    path.startsWith("/goals") ||
    path.startsWith("/settings") ||
    path.startsWith("/lists") ||
    path.startsWith("/projects") ||
    path.startsWith("/planner") ||
    path.startsWith("/focus") ||
    path.startsWith("/countdowns") ||
    path.startsWith("/health") ||
    path.startsWith("/onboarding");

  const isAuthPage = authOnlyPublicRoutes.some((r) => path.startsWith(r));

  // 2. Redirect to /login if user is unauthorized on a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 3. Redirect to / (Overview) if authenticated user visits /login or /signup
  if (isAuthPage && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Run middleware on all paths except asset/api endpoints
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
