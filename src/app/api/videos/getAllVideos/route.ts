import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import jwt from "jsonwebtoken";
import { get } from "http";

export async function GET(req: NextRequest) {

    function getTimeAgo(dateInput: Date | string): string {
        const now = new Date();
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

        const intervals: {
            unit: Intl.RelativeTimeFormatUnit;
            seconds: number;
        }[] = [
                { unit: 'year', seconds: 31536000 },
                { unit: 'month', seconds: 2592000 },
                { unit: 'week', seconds: 604800 },
                { unit: 'day', seconds: 86400 },
                { unit: 'hour', seconds: 3600 },
                { unit: 'minute', seconds: 60 },
                { unit: 'second', seconds: 1 },
            ];

        for (const { unit, seconds } of intervals) {
            const delta = Math.floor(secondsAgo / seconds);
            if (delta >= 1) {
                return rtf.format(-delta, unit);
            }
        }

        return "just now";
    }


    try {
        const data: any[] = []
        const params = req.nextUrl.searchParams
        const skip = params.get("skip") ? parseInt(params.get("skip")!) : 0;

        const token = req.cookies.get("token")?.value;
        try {
            if (!token) {
                return NextResponse.json({ error: "no token" }, { status: 400 });
            }
            const verify = jwt.verify(token, process.env.TOKEN!);
        } catch (error) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const videos = await prisma.video.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 16,
            skip: skip,
            include: {
                user: true,
            },
        });

        videos.forEach((video: { thumbnail: string; url: string; id: any; title: any; user: { name: any; id: any; }; viewCount: any; createdAt: string | Date; }) => {
            const thumbnail = cloudinary.url(video.thumbnail,
                {

                    transformation: [
                        { width: 640, height: 360, crop: "fill", gravity: "auto" },
                        { quality: "auto" },
                        { fetch_format: "auto" },]
                }
            )

            const url = cloudinary.url(video.url, {
                resource_type: "video",
                transformation: [
                    {
                        width: 640,
                        height: 360,
                        crop: "fill",
                        aspect_ratio: "16:9",
                        start_offset: "0",
                        duration: "5", // ✅ duration & start_offset must be in the same object
                        quality: "auto",
                        fetch_format: "auto",
                    },
                ],
            });
            
            data.push({
                id: video.id,
                title: video.title,
                thumbnail: thumbnail,
                url: url,

                userName: video.user.name,
                userId: video.user.id,
                viewCount: video.viewCount,
                createdAt: getTimeAgo(video.createdAt),
            });
        })

        return NextResponse.json({ data }, { status: 200 });

    } catch (error) {
        console.error("Error in GET request:", error);
        return new Response("Internal Server Error", { status: 500 });
    }

}