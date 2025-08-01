import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

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
            text: `Click the link to verify your account: ${process.env.PUBLIC_BASE_URL}/auth/check?token=${verficationToken}`,
        });
        console.log(`Verification email sent to ${user.email}`);

        return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
    } catch (error) {
        console.error("Error in verify route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

