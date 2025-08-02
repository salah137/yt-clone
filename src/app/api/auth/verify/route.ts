import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import redisClient from '@/lib/redis';
import transporter from '@/lib/nodemailer';

export async function POST(req: NextRequest) {


    try {
        const data = await req.json();
        const id = (req.cookies.get("userId"))?.value;

        if (!id) {
            return NextResponse.json({ error: "no id given" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.verified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 });
        }

        const verficationToken = await jwt.sign(
            {
                userId: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + (60 * 15),  // Token expires in 15 minutes
            }, process.env.TOKEN!,);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,

            to: user.email,
            subject: "Verify your account",
            text: `Click the link to verify your account: ${process.env.PUBLIC_BASE_URL}/auth/check`,
        });
        
        const resp = NextResponse.json({ message: "Verification email sent" }, { status: 200 });

        resp.cookies.set("verificationToken", verficationToken,  {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            
            }
        )

        redisClient.setEx(`verification:${user.id}`, 60 * 15, verficationToken); // Store token in Redis for 15 minutes

        return resp;
    } catch (error) {
        console.error("Error in verify route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

