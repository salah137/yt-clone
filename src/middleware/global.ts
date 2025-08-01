import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    console.log("Middleware token:", token);
    

     if (!token) {
        return NextResponse.redirect(new URL("/auth", req.url)); // Redirect if no token
    }

    try {
        const tok = new TextEncoder().encode(process.env.TOKEN!);
        
        const decoded = await jwtVerify(token, tok!) as unknown as { userId: string; email: string; verified: boolean };

        // Check if the user is verified
        if (!decoded.verified) {
            return NextResponse.redirect(new URL("/verify", req.url)); // Redirect to verify page if not verified
        }

    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.redirect(new URL("/auth", req.url)); // Redirect if token is invalid
    }

    return NextResponse.next();
}

// Middleware config to apply it to all routes
export const config = {
    matcher: "/((?!_next|api|auth|verify).*)", // Apply middleware to all routes except _next and api
};
