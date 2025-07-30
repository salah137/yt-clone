import {prisma} from '@/lib/prisma';
import { NextResponse } from 'next/server';
import z from 'zod';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const SignInSchema = z.object({
    email: z.string().email("Invalid email"),   
    password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(req: Request) { 
    try {
        const data = await req.json();
        const parse = SignInSchema.safeParse(data);

        if (!parse.success) {
            return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 409 });
        }

        const { email, password } = parse.data;

        
        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isPasswordValid = await argon2.verify(user.password, password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid password" }, { status: 401 });
        }

        let token = await jwt.sign(
            { userId: user.id, email: user.email }, process.env.TOKEN,   // Secret key
            { algorithm: 'HS256' }
        );

            const response = NextResponse.json(
                { success: "User created", userId: user.id },
                { status: 201 }
            );
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            
            });

            return response;
    } catch (error) {
        console.error("Error in signIn route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}