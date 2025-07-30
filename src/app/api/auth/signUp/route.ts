import { NextRequest, NextResponse } from "next/server";
import argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import z from "zod";
import { prisma } from "@/lib/prisma";

const SignUpSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        const parse = SignUpSchema.safeParse(data);

        if (!parse.success) {
            return NextResponse.json({ error: parse.error.flatten().fieldErrors }, { status: 400 });
        }

        const { name, email, password } = parse.data;

        const user = await prisma.user.findFirst({
            where: { email: email }
        });

        if (user) {
            return NextResponse.json({ error: "email already exists" }, { status: 409 });
        } else {
            const hashedPassword = await argon2.hash(password); 

            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword, 
                },
            });

            let token = await jwt.sign(
                { userId: newUser.id, email: newUser.email }, process.env.TOKEN,   // Secret key
                { algorithm: 'HS256' }
            )

            const response = NextResponse.json(
                { success: "User created", userId: newUser.id },
                { status: 201 }
            );
            response.cookies.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            
            });

            return response;
        }

    } catch (error) {
        console.error("Error in signUp route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}