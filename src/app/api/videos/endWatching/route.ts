import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma";
import { video } from "framer-motion/client";

export async function POST(req: NextRequest) {
    try {
        console.log("hello dzd");
        
        const { like, disLike, videoId } = await req.json()
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

        const check = await prisma.videoView.findUnique(
            {
                where: {
                    userId_videoId: {
                        userId: id,
                        videoId: videoId
                    }
                }
            }
        )

        if (!check) {
            await prisma.videoView.create(
                {
                    data : {
                        userId : id,
                        videoId : videoId
                    }
                }
            )

            const views = await prisma.videoView.count(
                {
                    where : {
                        videoId : videoId
                    }
                }
            )

            const vid = await prisma.video.update(
                {
                    where : {
                        id: videoId
                    },
                    data : {
                        viewCount: views
                    }
                }
            )
        }

        if (like) {
            const videoLike = await prisma.videoLike.findUnique(
                {
                    where: {
                        userId_videoId: {
                            userId: id,
                            videoId: videoId
                        }
                    }
                }
            )

            if (videoLike) {
                return NextResponse.json(
                    {}, {
                    status: 200
                }
                )
            }

            const videodDisLike = await prisma.videodDisLike.delete(
                {
                    where: {
                        userId_videoId: {
                            userId: id,
                            videoId: videoId
                        }
                    }
                }
            )

            await prisma.videoLike.create(
                {
                    data: {

                        userId: id,
                        videoId: videoId

                    }
                }
            )

            const likes = await prisma.videoLike.count({
                where: {
                    videoId: videoId
                }
            }
            )

            const disLike = await prisma.videodDisLike.count(
                {
                    where: {
                        videoId: videoId
                    }
                }
            )

            const video = await prisma.video.update(
                {
                    where: {
                        id: videoId,
                    },
                    data: {
                        likeCount: likes,
                        dislikeCount: disLike
                    }
                }
            )
        }

        if (disLike) {
            const videoLike = await prisma.videodDisLike.findUnique(
                {
                    where: {
                        userId_videoId: {
                            userId: id,
                            videoId: videoId
                        }
                    }
                }
            )

            if (videoLike) {
                return NextResponse.json(
                    {}, {
                    status: 200
                }
                )
            }

            await prisma.videoLike.delete(
                {
                    where: {
                        userId_videoId: {
                            userId: id,
                            videoId: videoId
                        }
                    }
                }
            )

            await prisma.videodDisLike.create(
                {
                    data: {

                        userId: id,
                        videoId: videoId

                    }
                }
            )

            const likes = await prisma.videoLike.count({
                where: {
                    videoId: videoId
                }
            }
            )

            const disLike = await prisma.videodDisLike.count(
                {
                    where: {
                        videoId: videoId
                    }
                }
            )

            const video = await prisma.video.update(
                {
                    where: {
                        id: videoId,
                    },
                    data: {
                        likeCount: likes,
                        dislikeCount: disLike
                    }
                }
            )


        }


    } catch (e) {
        console.log("error", e)
        return NextResponse.json(
            {
                errpr: "internal server Error"
            }, {
            status: 500
        }
        )
    }
}
