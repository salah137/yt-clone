import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value
        let id
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
            const playload = jwt.verify(token!, process.env.TOKEN!) as { userId: string }
            id = playload.userId
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

        const { content, videoId } = await req.json()

        if (!content || !videoId) {
            return NextResponse.json(
                {
                    error: "not enough paramentres"
                }, {
                status: 400
            }
            )
        }

        const video = await prisma.video.findUnique(
            {
                where: {
                    id: videoId
                }
            }
        )

        if (!video) {
            return NextResponse.json(
                {
                    error: "no video found"
                }, {
                status: 400
            }
            )
        }


        const comment = await prisma.comment.create(
            {
                data: {
                    userId: id!,
                    videoId: videoId,
                    content: content
                }
            }
        )

        return NextResponse.json(
            {
                msg: "comment creates sucefully"
            }
        )

    } catch (e) {
        console.log("error", e);
        return NextResponse.json(
            {
                error: "internal sever error"
            }, {
            status: 500
        }
        )

    }

}