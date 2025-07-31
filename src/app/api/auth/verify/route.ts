import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import z from 'zod';
import * as argon2 from 'argon2';
import transporter from '@/lib/nodemailer';

const VerifySchema = z.object({
    id: z.string().min(1, "id is required"),
});

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const parse = VerifySchema.safeParse(data);
        if (!parse.success) {
            return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
        }
        const { id } = parse.data;
        const user = await prisma.user.findUnique({
            where: { id: id }
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (user.verified) {
            return NextResponse.json({ message: "User already verified" }, { status: 200 });
        }

        const verficationToken = await argon2.hash(id);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,   
            
            to: user.email,
            subject: "Verify your account",
            text: `Click the link to verify your account: ${process.env.PUBLIC_BASE_URL}/auth/check?id=${user.id}&token=${verficationToken}`,
        });
        console.log(`Verification email sent to ${user.email}`);
        
        return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
    } catch (error) {
        console.error("Error in verify route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
} 

