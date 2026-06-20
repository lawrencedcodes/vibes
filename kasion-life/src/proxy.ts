import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// Specify protected and public routes
const protectedRoutes = ["/", "/tracker", "/journal", "/goals", "/settings", "/lists"];
const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Quick checks to see if route needs auth or is public login
  const isProtectedRoute = path === "/" || 
                           path.startsWith("/tracker") || 
                           path.startsWith("/journal") || 
                           path.startsWith("/goals") || 
                           path.startsWith("/settings") || 
                           path.startsWith("/lists") ||
                           path.startsWith("/projects") ||
                           path.startsWith("/planner");
  const isPublicRoute = path.startsWith("/login");

  // Get session cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  // 1. Redirect to /login if user is unauthorized on a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 2. Redirect to / (Overview) if authenticated user visits login
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Run middleware on all paths except asset/api endpoints
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
