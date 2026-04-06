import { NextRequest, NextResponse } from "next/server";


const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;

export async function proxy(req: NextRequest) {

    const host = req.headers.get("host") || "";
    const isCustomDomain = !host.includes("fasturl.in") && !host.includes("localhost");
    if (isCustomDomain) {
        const url = req.nextUrl.clone();
        return NextResponse.next();
    }


    const token = req.cookies.get("token")?.value;
    const pathName = req.nextUrl.pathname;

    if(pathName.startsWith('/api/cronJobs')) {
        return NextResponse.next();
    }
    const protectedRoutes = ['/urls', '/qr', '/analytics']

    const isProtectedRoute = protectedRoutes.some(route => pathName.startsWith(route))

    if(isProtectedRoute && !token) {
        const loginUrl = new URL('/auth/signin', req.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next();

}

export const config = {
    matcher: [
        '/((?!api|_next|favicon.ico).*)',
        '/urls/:path*',
        '/qr/:path*',
        '/analytics/:path*',
    ]
}