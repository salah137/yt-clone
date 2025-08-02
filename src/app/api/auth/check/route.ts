import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import redisClient from "@/lib/redis";

export async function POST(req: NextRequest) {
    try {
    const token = req.cookies.get("verificationToken")?.value;

    if (!token)
        return NextResponse.json({
            error : "token should be given"
        },{status : 400})

    const redisToken = await redisClient.get(`verification:${token}`);

    if (!redisToken) {
        return NextResponse.json(
            { error: "Verification token expired or invalid" },
            { status: 400 }
        );
    }
    
    try{
        const playload = jwt.verify(token,process.env.TOKEN!) as {userId : string , email : string} 
        await prisma.user.update(
            {
                where: {
                    id: playload.userId,
                    email: playload.email
                },
                data : {
                    verified : true
                }
            }
        )

        const response = NextResponse.json(
            {
                success: "User verified successfully",
            },
            { status: 200 }
        );

        response.cookies.set("verified", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        await redisClient.del(`verification:${token}`); 
        
        return response;
    
    } catch(e){
        console.log("error",e);
        return NextResponse.json(
            {
                error: "invalid token"
            }, {
                status : 400
            }
        )
        
    } } catch(e){
        console.log("error => ",e)
        return NextResponse.json(
            {
                error : "internal server error"
            },
            {
                status : 500
            }
        )
    }
}