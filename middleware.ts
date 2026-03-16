import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const pathName = request.nextUrl.pathname;

    const protectedRoutes = ['/urls', '/qr', '/analytics']

    const isProtectedRoute = protectedRoutes.some(route => pathName.startsWith(route))

    if(isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/signin', request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
        '/urls/:path*',
        '/qr/:path*',
        '/analytics/:path*',
        '/',
    ]
}