import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value

        if (!token) {
            return NextResponse.json(
                {
                    error: "Unauthorized"
                }, {
                status: 400
            }
            )
        }

        try {
            const playload = jwt.verify(token!, process.env.TOKEN!)
        } catch (e) {
            console.log(e);

            return NextResponse.json(
                {
                    error: "invalid token"
                }, {
                status: 409
            }
            )
        }

        const videoId = req.nextUrl.searchParams.get("videoId")
        if (!videoId) {
            return NextResponse.json(
                {
                    error: "no video id given"
                },
                {
                    status: 400
                }
            )
        }
        const skip = req.nextUrl.searchParams.get("skip")

        const comments = await prisma.comment.findMany(
            {
                orderBy : {
                    createdAt : "desc"
                },
                where: {
                    videoId: videoId
                },
                skip: parseInt(skip!) | 0 ,
                take: 10,
                include: {
                    user: true
                }
            }
        )

        const data: any[] = []

        comments.map(
            (comment) => {
                
                const { id, userId, content, createdAt, subCount } = comment
                const { name } = comment.user

                data.push ({
                    id, userName: name, content, subCount, userId, createdAt : createdAt.toISOString()
                })
            }
        )

        return NextResponse.json(
            {
                data
            }
        )
    } catch (e) {
        console.log("error", e)
        return NextResponse.json(
            {
                error: "internal server error"
            }, {
            status: 500
        }
        )
    }
}