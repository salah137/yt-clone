import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url)); // Redirect if no token
    }

    
    const verified = req.cookies.get("verified")?.value;

    if (!verified) {
        return NextResponse.redirect(new URL("/veify", req.url)); // Redirect to verification if not verified
    }   

    return NextResponse.next();
}

// Middleware config to apply it to all routes
export const config = {
    matcher: "/((?!_next|api|auth|verify).*)", // Apply middleware to all routes except _next and api
};
