import { NextRequest, NextResponse } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/auth";

// Protected routes
const protectedRoutes = ["/admin", "/keystatic"];
const publicAdminRoutes = ["/admin/login"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some((route) =>
        path.startsWith(route)
    );
    const isPublicAdminRoute = publicAdminRoutes.some((route) =>
        path.startsWith(route)
    );

    if (isProtectedRoute && !isPublicAdminRoute) {
        const session = request.cookies.get(SESSION_COOKIE)?.value;
        const payload = session ? await decrypt(session) : null;

        if (!payload) {
            // Redirect to login if not authenticated
            const loginUrl = new URL("/admin/login", request.nextUrl.origin);
            // Optionally add redirect parameter
            loginUrl.searchParams.set("from", path);
            return NextResponse.redirect(loginUrl);
        }
    }

    // If authenticated and trying to access login, redirect to admin
    if (isPublicAdminRoute) {
        const session = request.cookies.get(SESSION_COOKIE)?.value;
        const payload = session ? await decrypt(session) : null;

        if (payload) {
            return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
        }
    }

    return NextResponse.next();
}

// Routes that should be handled by middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
